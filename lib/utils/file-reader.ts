import { promises as fs } from "fs";
import path from "path";
import { TSXFile } from "../types";
import { parseAST } from "./parser";

import { anyType } from "../smells/any-type";
import { nonNullAssertions } from "../smells/non-null-assertions";
import { missingUnionTypeAbstraction } from "../smells/missing-union-type-abstraction";
import { enumImplicitValues } from "../smells/enum-implicit-values";
import { multipleBooleansForState } from "../smells/multiple-booleans-for-state";
import { overlyFlexibleProps } from "../smells/overly-flexible-props";

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

    const anyTypeSmells = anyType(ast);
    const nonNullSmells = nonNullAssertions(ast);
    const missingUnionSmells = missingUnionTypeAbstraction(ast);
    const enumImplicitSmells = enumImplicitValues(ast);
    const multipleBooleansSmells = multipleBooleansForState(ast);
    const overlyFlexibleSmells = overlyFlexibleProps(ast);    
    console.log(anyTypeSmells);
    console.log(nonNullSmells);
    console.log(missingUnionSmells);
    console.log(enumImplicitSmells);
    console.log(multipleBooleansSmells);
    console.log(overlyFlexibleSmells)
  }
}