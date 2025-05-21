import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]