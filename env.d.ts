/// <reference types="@cloudflare/workers-types/2023-07-01" />

interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
}
