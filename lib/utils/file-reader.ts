import { promises as fs } from "fs";
import path from "path";
import { TSXFile } from "../types";
import { parseAST } from "./parser";
import { ParseResult } from "@babel/parser";

async function* readFiles(dirname: string): AsyncGenerator<TSXFile> {
  if(!(await fs.access(dirname).then(() => true).catch(() => false))) {
    console.log("Please provide a valid directory");
    process.exit(0);
  }

  const directoryEntries = await fs.readdir(dirname, { withFileTypes: true });

  for(const directoryEntry of directoryEntries) {
    const fullPath = path.join(dirname, directoryEntry.name);

    if(directoryEntry.isDirectory()) {
      yield* readFiles(fullPath);
    }

    if(directoryEntry.isFile() && directoryEntry.name.endsWith(".tsx")) {
      const content = await fs.readFile(fullPath, 'utf-8');
      yield { path: fullPath, content };
    }
  }
}

export async function processFiles(path: string) {
  for await (const file of readFiles(path)) {
    const ast = parseAST(file);
    console.log(ast);
  }
}