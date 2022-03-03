import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { exit } from "process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __base = process.env.AMADEUS_BASE || "";
if (!__base) exit();

const path = resolve(__dirname, "build/manifest.json");
let manifest = readFileSync(path).toString();
manifest = manifest.replace('"start_url": "/"', `"start_url": "${__base}/"`);
manifest = manifest.replace('"scope": "/"', `"scope": "${__base}/"`);
writeFileSync(path, manifest);
