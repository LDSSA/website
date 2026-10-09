import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const output = join(root, "dist");
const errors = [];

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const requiredPages = [
  "index.html",
  "starters-academy/index.html",
  "prep-course/index.html",
  "about-us/index.html",
  "jobs/index.html",
  "404.html",
];

for (const page of requiredPages) {
  if (!existsSync(join(output, page)))
    errors.push(`Missing generated page: ${page}`);
}

const redirects = readFileSync(join(output, "_redirects"), "utf8");
for (const legacyPath of [
  "/curriculum/",
  "/faq/",
  "/comms-associate-position/",
  "/pythonzerotohero/",
  "/d-form_confirmation.html",
]) {
  if (!redirects.includes(legacyPath))
    errors.push(`Missing redirect for ${legacyPath}`);
}

const htmlFiles = walk(output).filter((file) => file.endsWith(".html"));
const knownRedirects = new Set(
  redirects
    .split("\n")
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean),
);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const name = relative(output, file);
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  if (h1Count !== 1) errors.push(`${name}: expected one h1, found ${h1Count}`);
  if (!/<meta name="description" content="[^"]+"/.test(html))
    errors.push(`${name}: missing meta description`);
  if (
    !/<link rel="canonical" href="https:\/\/www\.lisbondatascience\.org/.test(
      html,
    )
  )
    errors.push(`${name}: missing production canonical URL`);
  if (/unbounce|builder-assets|\bclkn?\//i.test(html))
    errors.push(`${name}: contains an Unbounce dependency`);

  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = href.split(/[?#]/)[0] || "/";
    if (/\.[a-z0-9]+$/i.test(path)) {
      if (!existsSync(join(output, path)))
        errors.push(`${name}: missing local asset ${path}`);
      continue;
    }
    const target =
      path === "/"
        ? join(output, "index.html")
        : join(output, path, "index.html");
    if (
      !existsSync(target) &&
      !knownRedirects.has(path) &&
      !knownRedirects.has(`${path}/`)
    ) {
      errors.push(`${name}: broken internal link ${href}`);
    }
  }

  for (const [, src] of html.matchAll(
    /(?:src|content)="(\/[^"?#]+\.(?:png|jpe?g|svg|webp|avif))"/gi,
  )) {
    if (!existsSync(join(output, src)))
      errors.push(`${name}: missing image ${src}`);
  }
}

const allHtml = htmlFiles.map((file) => readFileSync(file, "utf8")).join("\n");
for (const formId of [
  "63f9e4e2f0116a4cabfef7db",
  "615c9641c71e8685f183bd18",
  "6172e62fe625581864e3f857",
]) {
  const endpoint = `https://form.flodesk.com/forms/${formId}/submit`;
  if (!allHtml.includes(endpoint))
    errors.push(`Missing preserved Flodesk endpoint: ${endpoint}`);
}

if (!allHtml.includes("https://assets.flodesk.com/universal.mjs"))
  errors.push("Missing modern Flodesk form runtime");
if (!allHtml.includes("https://assets.flodesk.com/universal.js"))
  errors.push("Missing legacy Flodesk form runtime fallback");

if (!existsSync(join(output, "sitemap-index.xml")))
  errors.push("Missing generated sitemap index");
if (!existsSync(join(output, "_headers")))
  errors.push("Missing Cloudflare headers configuration");

if (errors.length > 0) {
  console.error(`Site contract checks failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Site contract checks passed for ${htmlFiles.length} generated pages.`,
);
