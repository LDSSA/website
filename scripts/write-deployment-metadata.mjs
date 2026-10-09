import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const [outputArgument = "dist", commit, branch] = process.argv.slice(2);

if (!/^[0-9a-f]{40}$/i.test(commit ?? "")) {
  console.error("Deployment metadata requires a 40-character Git commit SHA.");
  process.exit(1);
}

if (!branch || !/^[A-Za-z0-9._/-]+$/.test(branch)) {
  console.error("Deployment metadata requires a valid Git branch name.");
  process.exit(1);
}

const output = resolve(outputArgument);
mkdirSync(output, { recursive: true });
writeFileSync(
  join(output, "deployment.json"),
  `${JSON.stringify({ commit: commit.toLowerCase(), branch }, null, 2)}\n`,
  "utf8",
);

console.log(
  `Wrote deployment metadata for ${branch} at ${commit.slice(0, 8)}.`,
);
