const { loadServerEnv } = require('./_lib/loadServerEnv');
const { sendJson } = require('./_lib/sendJson');
const { getRazorpayKeys, paymentsConfigured } = require('./_lib/razorpayConfig');

module.exports = function handler(_req, res) {
  try {
    loadServerEnv();
    const configured = paymentsConfigured();
    const { keyId } = getRazorpayKeys();
    sendJson(res, 200, {
      configured,
      keyId: configured ? keyId : null,
    });
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'payment-status failed',
    });
  }
};
