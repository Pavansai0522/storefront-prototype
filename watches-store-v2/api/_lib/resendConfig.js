function envPresent(name) {
  return Boolean(process.env[name]?.trim());
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? '';
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() ?? '';
  const fromName = process.env.RESEND_FROM_NAME?.trim() ?? 'PR Watches & Mobiles';
  const notifyEmail =
    process.env.ORDER_NOTIFY_EMAIL?.trim() ??
    process.env.VITE_STORE_EMAIL?.trim() ??
    '';

  return { apiKey, fromEmail, fromName, notifyEmail };
}

function resendConfigured() {
  const { apiKey, fromEmail } = getResendConfig();
  return Boolean(apiKey && fromEmail);
}

module.exports = { getResendConfig, resendConfigured, envPresent };
