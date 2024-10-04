/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string // Ensure this matches your usage
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENV: 'development' | 'production'
  readonly VITE_DEBUG_MODE: string
  readonly VITE_FEATURE_FLAG_NEW_UI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv {}
}
