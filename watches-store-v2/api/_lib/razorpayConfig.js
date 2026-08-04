function getRazorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.VITE_RAZORPAY_KEY_ID ?? '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';
  return { keyId: keyId.trim(), keySecret: keySecret.trim() };
}

function paymentsConfigured() {
  const { keyId, keySecret } = getRazorpayKeys();
  return Boolean(keyId && keySecret);
}

module.exports = { getRazorpayKeys, paymentsConfigured };
