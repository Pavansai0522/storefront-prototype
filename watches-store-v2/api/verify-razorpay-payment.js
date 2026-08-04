const { loadServerEnv } = require('./_lib/loadServerEnv');
const { sendJson } = require('./_lib/sendJson');
const { handleVerifyRazorpayPayment } = require('./_lib/ordersHttp');

module.exports = async function handler(req, res) {
  try {
    loadServerEnv();
    await handleVerifyRazorpayPayment(req, res);
  } catch (err) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : 'Function failed to start.';
      sendJson(res, 500, { error: message });
    }
  }
};
