declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_BASE_URL: string
    VITE_ENV: 'development' | 'production'
    VITE_DEBUG_MODE: string
    VITE_FEATURE_FLAG_NEW_UI: string
  }
}
