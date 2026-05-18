/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_E164?: string;
  readonly VITE_PHONE_DISPLAY?: string;
  readonly VITE_STORE_EMAIL?: string;
  readonly VITE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
