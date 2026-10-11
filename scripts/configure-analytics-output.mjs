import { readFile, writeFile } from "node:fs/promises";

const analyticsToken = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

if (analyticsToken) {
  const headersUrl = new URL("../dist/_headers", import.meta.url);
  const headers = await readFile(headersUrl, "utf8");
  const configuredHeaders = headers
    .replace(
      "connect-src 'self'",
      "connect-src 'self' https://cloudflareinsights.com",
    )
    .replace(
      "script-src 'self'",
      "script-src 'self' https://static.cloudflareinsights.com",
    );

  if (configuredHeaders === headers) {
    throw new Error("Unable to add Cloudflare Web Analytics to the CSP.");
  }

  await writeFile(headersUrl, configuredHeaders);
}
