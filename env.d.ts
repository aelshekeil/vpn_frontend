/// <reference types="@cloudflare/workers-types" />

// Rest of your file...
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
}