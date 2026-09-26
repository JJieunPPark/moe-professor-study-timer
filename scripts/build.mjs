import { cp, mkdir, rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");

const copyTargets = [
  ["index.html", "index.html"],
  ["css", "css"],
  ["js", "js"],
  ["public", "public"],
  ["audio", "audio"],
  ["node_modules/pixi.js/dist/pixi.min.js", "vendor/pixi.js/pixi.min.js"],
  [
    "node_modules/@naari3/pixi-live2d-display/dist/cubism5.min.js",
    "vendor/naari-pixi-live2d-display/cubism5.min.js"
  ]
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const [source, destination] of copyTargets) {
  const destinationPath = path.join(outputRoot, destination);
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await cp(path.join(projectRoot, source), destinationPath, { recursive: true });
}

console.log(`Production files written to ${outputRoot}`);
