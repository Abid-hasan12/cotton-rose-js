import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceDirectories = ["app", "components", "data", "css"];
const extensions = new Set([".js", ".jsx", ".css"]);
const blocked = [
  [/Cottonrose|Cotton Rose BD/g, "inconsistent public brand spelling"],
  [/20XX|Dhaka-1330|500\+ merchandising|href=["']#["']/gi, "placeholder or dead public content"],
  [/\bwe manufacture\b|\bour factor(?:y|ies)\b|\bproduction capacity\b/gi, "manufacturer positioning"],
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return extensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return nested.flat();
}

const files = (await Promise.all(sourceDirectories.map((directory) => walk(path.join(root, directory))))).flat();
const failures = [];
const localImages = new Set();

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const [pattern, label] of blocked) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) failures.push(`${path.relative(root, file)}: ${label} (${match[0]})`);
  }
  for (const match of text.matchAll(/["'`](\/images\/[^"'`?]+)["'`]/g)) localImages.add(match[1]);
}

for (const image of localImages) {
  try { await access(path.join(root, "public", image.replace(/^\//, ""))); }
  catch { failures.push(`Missing local image: ${image}`); }
}

if (failures.length) {
  console.error(`Content check failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log(`Content check passed across ${files.length} source files and ${localImages.size} local image references.`);
