const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { join } = require('node:path');
const { sendJson } = require('./sendJson');
const { readJsonBody } = require('./readJsonBody');
const { getSupabaseAdmin } = require('./supabaseAdmin');
const { getRazorpayKeys, paymentsConfigured } = require('./razorpayConfig');

const requireFromPkg = createRequire(join(process.cwd(), 'package.json'));

function trimString(value, maxLen) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLen);
}

function parseQty(value) {
  const qty = Number(value);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
    return null;
  }
  return qty;
}

function parseCartItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }
  const items = [];
  for (const row of rawItems) {
    const productId = trimString(row?.productId, 64);
    const qty = parseQty(row?.qty);
    if (!productId || qty == null) {
      return null;
    }
    items.push({ productId, qty });
  }
  return items;
}

function parseCustomer(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const name = trimString(raw.name, 120);
  const phone = trimString(raw.phone, 20).replace(/\s/g, '');
  if (!name || phone.length < 10) {
    return null;
  }
  return {
    name,
    email: trimString(raw.email, 160),
    phone,
    addressLine: trimString(raw.addressLine, 300),
    landmark: trimString(raw.landmark, 120),
    postalCode: trimString(raw.postalCode, 12),
    city: trimString(raw.city, 80),
    state: trimString(raw.state, 80),
    country: trimString(raw.country, 80) || 'India',
    notes: trimString(raw.notes, 500),
  };
}

async function handleCreateRazorpayOrder(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!paymentsConfigured()) {
    sendJson(res, 503, { error: 'Payments not configured' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const clientId = trimString(body.clientId, 64);
  const deliveryInr = Number(body.deliveryInr);
  const cartItems = parseCartItems(body.items);
  const customer = parseCustomer(body.customer);

  if (!clientId || !cartItems || !customer) {
    sendJson(res, 400, { error: 'Invalid checkout payload' });
    return;
  }

  if (!Number.isInteger(deliveryInr) || deliveryInr < 0) {
    sendJson(res, 400, { error: 'Invalid delivery charge' });
    return;
  }

  if (!customer.addressLine || !customer.postalCode || !customer.city || !customer.state) {
    sendJson(res, 400, { error: 'Complete shipping address is required' });
    return;
  }

  const supabase = getSupabaseAdmin();
  const productIds = cartItems.map((item) => item.productId);

  const { data: clientRow, error: clientError } = await supabase
    .from('clients')
    .select('id, site_active')
    .eq('id', clientId)
    .maybeSingle();

  if (clientError) {
    sendJson(res, 500, { error: clientError.message });
    return;
  }

  if (!clientRow || !clientRow.site_active) {
    sendJson(res, 404, { error: 'Store not available' });
    return;
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, brand, price_inr, in_stock')
    .eq('client_id', clientId)
    .in('id', productIds);

  if (productsError) {
    sendJson(res, 500, { error: productsError.message });
    return;
  }

  const productMap = new Map((products ?? []).map((row) => [row.id, row]));
  let subtotalInr = 0;
  const orderItems = [];

  for (const cartItem of cartItems) {
    const product = productMap.get(cartItem.productId);
    if (!product) {
      sendJson(res, 400, { error: 'One or more products are no longer available' });
      return;
    }
    if (!product.in_stock) {
      sendJson(res, 400, { error: `${product.name} is out of stock` });
      return;
    }
    subtotalInr += product.price_inr * cartItem.qty;
    orderItems.push({
      product_id: product.id,
      name: product.name,
      brand: product.brand,
      unit_price_inr: product.price_inr,
      qty: cartItem.qty,
    });
  }

  const totalInr = subtotalInr + deliveryInr;
  if (totalInr < 1) {
    sendJson(res, 400, { error: 'Order total must be at least ₹1' });
    return;
  }

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      client_id: clientId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      address_line: customer.addressLine,
      landmark: customer.landmark,
      postal_code: customer.postalCode,
      city: customer.city,
      state: customer.state,
      country: customer.country,
      notes: customer.notes,
      subtotal_inr: subtotalInr,
      delivery_inr: deliveryInr,
      total_inr: totalInr,
      status: 'pending',
    })
    .select('id')
    .single();

  if (orderError || !orderRow) {
    sendJson(res, 500, { error: orderError?.message ?? 'Failed to create order' });
    return;
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    orderItems.map((item) => ({
      order_id: orderRow.id,
      ...item,
    })),
  );

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', orderRow.id);
    sendJson(res, 500, { error: itemsError.message });
    return;
  }

  const { keyId, keySecret } = getRazorpayKeys();
  const Razorpay = requireFromPkg('razorpay');
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: totalInr * 100,
      currency: 'INR',
      receipt: orderRow.id.replace(/-/g, '').slice(0, 40),
      notes: {
        client_id: clientId,
        order_id: orderRow.id,
      },
    });
  } catch (err) {
    await supabase.from('orders').update({ status: 'failed' }).eq('id', orderRow.id);
    const message = err instanceof Error ? err.message : 'Failed to create Razorpay order';
    sendJson(res, 502, { error: message });
    return;
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ razorpay_order_id: razorpayOrder.id })
    .eq('id', orderRow.id);

  if (updateError) {
    sendJson(res, 500, { error: updateError.message });
    return;
  }

  sendJson(res, 200, {
    orderId: orderRow.id,
    razorpayOrderId: razorpayOrder.id,
    amount: totalInr * 100,
    currency: 'INR',
    keyId,
  });
}

async function handleVerifyRazorpayPayment(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!paymentsConfigured()) {
    sendJson(res, 503, { error: 'Payments not configured' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  const orderId = trimString(body.orderId, 64);
  const razorpayOrderId = trimString(body.razorpayOrderId, 64);
  const razorpayPaymentId = trimString(body.razorpayPaymentId, 64);
  const razorpaySignature = trimString(body.razorpaySignature, 256);

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    sendJson(res, 400, { error: 'Missing payment verification fields' });
    return;
  }

  const { keySecret } = getRazorpayKeys();
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    sendJson(res, 400, { error: 'Invalid payment signature' });
    return;
  }

  const supabase = getSupabaseAdmin();
  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .select('id, status, razorpay_order_id, total_inr')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError) {
    sendJson(res, 500, { error: orderError.message });
    return;
  }

  if (!orderRow) {
    sendJson(res, 404, { error: 'Order not found' });
    return;
  }

  if (orderRow.razorpay_order_id !== razorpayOrderId) {
    sendJson(res, 400, { error: 'Razorpay order mismatch' });
    return;
  }

  if (orderRow.status === 'paid') {
    sendJson(res, 200, { orderId: orderRow.id, status: 'paid' });
    return;
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    })
    .eq('id', orderId);

  if (updateError) {
    sendJson(res, 500, { error: updateError.message });
    return;
  }

  sendJson(res, 200, { orderId: orderRow.id, status: 'paid' });
}

module.exports = { handleCreateRazorpayOrder, handleVerifyRazorpayPayment };
