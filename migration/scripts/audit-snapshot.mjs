import { readdirSync, readFileSync } from "node:fs";

const snapshotDirectory = new URL("../raw/", import.meta.url);
const files = readdirSync(snapshotDirectory)
  .filter((file) => file.endsWith(".html"))
  .sort();

const matches = (source, expression) =>
  [...source.matchAll(expression)].map((match) => match[1]);

const unique = (values) => [...new Set(values)].sort();

for (const file of files) {
  const source = readFileSync(new URL(file, snapshotDirectory), "utf8");
  const result = {
    file,
    title: matches(source, /<title>(.*?)<\/title>/gis)[0] ?? null,
    description:
      matches(source, /<meta name="description" content="([^"]*)"/gi)[0] ??
      null,
    unbouncePageId:
      matches(source, /window\.ub = \{"page":\{"id":"([^"]+)/g)[0] ?? null,
    flodeskFormIds: unique(
      matches(source, /https:\/\/form\.flodesk\.com\/forms\/([^/"']+)/g),
    ),
    flodeskSubmitTokens: unique(
      matches(source, /name="Flodesk_Submit_Token"[^>]+value="([^"]+)/g),
    ),
    internalPaths: unique(
      matches(
        source,
        /(?:href|data-action-url)="(?:clkn?\/)?(?:https?:)?(?:\/\/)?(?:www\.)?lisbondatascience\.org([^"?# ]*)/gi,
      ).map((path) => path || "/"),
    ),
    imageUrls: unique(
      matches(source, /data-src-(?:desktop|mobile)-[123]x="([^"]+)/g),
    ),
    scriptUrls: unique(matches(source, /<script[^>]+src="([^"]+)/gi)),
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
