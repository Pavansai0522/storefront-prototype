const { createRequire } = require('node:module');
const { join } = require('node:path');
const { getResendConfig, resendConfigured } = require('./resendConfig');

const requireFromPkg = createRequire(join(process.cwd(), 'package.json'));

function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildItemsText(items) {
  return items
    .map(
      (item) =>
        `- ${item.name} (${item.brand}) × ${item.qty} — ${formatInr(item.unit_price_inr * item.qty)}`,
    )
    .join('\n');
}

function buildItemsHtml(items) {
  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>` +
        `<td style="padding:8px 0;border-bottom:1px solid #eee;">${item.qty}</td>` +
        `<td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatInr(item.unit_price_inr * item.qty))}</td></tr>`,
    )
    .join('');
  return (
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
    '<thead><tr><th align="left">Item</th><th align="left">Qty</th><th align="right">Amount</th></tr></thead>' +
    `<tbody>${rows}</tbody></table>`
  );
}

function buildAddressBlock(order) {
  const parts = [
    order.address_line,
    order.landmark,
    [order.city, order.state, order.postal_code].filter(Boolean).join(', '),
    order.country,
  ].filter((part) => typeof part === 'string' && part.trim().length > 0);
  return parts.join('\n');
}

function buildCustomerEmail(order, items, storeName) {
  const subject = `Order confirmed — ${storeName} (#${order.id.slice(0, 8)})`;
  const itemsText = buildItemsText(items);
  const address = buildAddressBlock(order);
  const text =
    `Hi ${order.customer_name},\n\n` +
    `Thank you for your order at ${storeName}.\n\n` +
    `Order ID: ${order.id}\n` +
    `Payment: Received\n\n` +
    `Items:\n${itemsText}\n\n` +
    `Subtotal: ${formatInr(order.subtotal_inr)}\n` +
    `Delivery: ${formatInr(order.delivery_inr)}\n` +
    `Total: ${formatInr(order.total_inr)}\n\n` +
    `Delivery address:\n${address}\n\n` +
    `We will contact you shortly about delivery.\n\n` +
    `${storeName}`;

  const html =
    `<p>Hi ${escapeHtml(order.customer_name)},</p>` +
    `<p>Thank you for your order at <strong>${escapeHtml(storeName)}</strong>.</p>` +
    `<p><strong>Order ID:</strong> ${escapeHtml(order.id)}<br>` +
    `<strong>Payment:</strong> Received</p>` +
    buildItemsHtml(items) +
    `<p style="margin-top:16px;">` +
    `Subtotal: ${escapeHtml(formatInr(order.subtotal_inr))}<br>` +
    `Delivery: ${escapeHtml(formatInr(order.delivery_inr))}<br>` +
    `<strong>Total: ${escapeHtml(formatInr(order.total_inr))}</strong></p>` +
    `<p><strong>Delivery address</strong><br>${escapeHtml(address).replace(/\n/g, '<br>')}</p>` +
    `<p>We will contact you shortly about delivery.</p>` +
    `<p>${escapeHtml(storeName)}</p>`;

  return { subject, text, html };
}

function buildStoreEmail(order, items, storeName) {
  const subject = `New paid order — ${order.customer_name} (${formatInr(order.total_inr)})`;
  const itemsText = buildItemsText(items);
  const address = buildAddressBlock(order);
  const text =
    `New order on ${storeName}\n\n` +
    `Order ID: ${order.id}\n` +
    `Customer: ${order.customer_name}\n` +
    `Phone: ${order.customer_phone}\n` +
    `Email: ${order.customer_email || '(not provided)'}\n\n` +
    `Items:\n${itemsText}\n\n` +
    `Subtotal: ${formatInr(order.subtotal_inr)}\n` +
    `Delivery: ${formatInr(order.delivery_inr)}\n` +
    `Total: ${formatInr(order.total_inr)}\n\n` +
    `Address:\n${address}\n` +
    (order.notes ? `\nNotes: ${order.notes}\n` : '');

  const html =
    `<p><strong>New paid order</strong> on ${escapeHtml(storeName)}</p>` +
    `<p>Order ID: ${escapeHtml(order.id)}<br>` +
    `Customer: ${escapeHtml(order.customer_name)}<br>` +
    `Phone: ${escapeHtml(order.customer_phone)}<br>` +
    `Email: ${escapeHtml(order.customer_email || '(not provided)')}</p>` +
    buildItemsHtml(items) +
    `<p style="margin-top:16px;">` +
    `Subtotal: ${escapeHtml(formatInr(order.subtotal_inr))}<br>` +
    `Delivery: ${escapeHtml(formatInr(order.delivery_inr))}<br>` +
    `<strong>Total: ${escapeHtml(formatInr(order.total_inr))}</strong></p>` +
    `<p><strong>Address</strong><br>${escapeHtml(address).replace(/\n/g, '<br>')}</p>` +
    (order.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>` : '');

  return { subject, text, html };
}

/**
 * Send customer + store emails after payment is verified. Never throws — payment must succeed even if email fails.
 */
async function sendOrderPlacedEmails(order, items) {
  if (!resendConfigured()) {
    return { sent: false, reason: 'not_configured' };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { sent: false, reason: 'no_items' };
  }

  const { Resend } = requireFromPkg('resend');
  const { apiKey, fromEmail, fromName, notifyEmail } = getResendConfig();
  const resend = new Resend(apiKey);
  const from = `${fromName} <${fromEmail}>`;
  const storeName = fromName;
  const results = { customer: null, store: null };

  const customerEmail = order.customer_email?.trim();
  if (!customerEmail && !notifyEmail) {
    return { sent: false, reason: 'no_recipients' };
  }

  if (customerEmail) {
    const content = buildCustomerEmail(order, items, storeName);
    const { data, error } = await resend.emails.send({
      from,
      to: customerEmail,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    results.customer = error ? { ok: false, error: error.message } : { ok: true, id: data?.id ?? null };
  }

  if (notifyEmail) {
    const content = buildStoreEmail(order, items, storeName);
    const { data, error } = await resend.emails.send({
      from,
      to: notifyEmail,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    results.store = error ? { ok: false, error: error.message } : { ok: true, id: data?.id ?? null };
  }

  const sent = Boolean(results.customer?.ok || results.store?.ok);
  return { sent, results };
}

module.exports = { sendOrderPlacedEmails, resendConfigured };
