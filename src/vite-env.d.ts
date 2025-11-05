/// <reference types="vite/client" />

type ViteTypeOptions = {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: true
}

type ImportMetaEnv = {
  readonly VITE_MASSIVE_API_KEY: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}

