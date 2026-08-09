const { loadServerEnv } = require('./_lib/loadServerEnv');
const { sendJson } = require('./_lib/sendJson');
const { handleUploadProductImage } = require('./_lib/uploadProductImageHttp');

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  try {
    loadServerEnv();
    await handleUploadProductImage(req, res);
  } catch (err) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : 'Function failed to start.';
      sendJson(res, 500, { error: message });
    }
  }
};
