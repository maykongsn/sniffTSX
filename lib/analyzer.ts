import { readFiles } from "./utils/file-reader";
import { parseAST } from "./utils/parser";
import { SourceLocation, TSXFile } from "./types";

import { anyType } from "./smells/any-type";
import { enumImplicitValues } from "./smells/enum-implicit-values";
import { missingUnionTypeAbstraction } from "./smells/missing-union-type-abstraction";
import { multipleBooleansForState } from "./smells/multiple-booleans-for-state";
import { nonNullAssertions } from "./smells/non-null-assertions";
import { overlyFlexibleProps } from "./smells/overly-flexible-props";

export type AnalysisOutput = {
  anyType?: SourceLocation[];
  nonNullAssertions?: SourceLocation[];
  missingUnionTypeAbstraction?: SourceLocation[];
  enumImplicitValues?: SourceLocation[];
  multipleBooleansForState?: SourceLocation[];
  overlyFlexibleProps?: SourceLocation[];
}

const analyzers = {
  anyType,
  nonNullAssertions,
  missingUnionTypeAbstraction,
  enumImplicitValues,
  multipleBooleansForState,
  overlyFlexibleProps
}

export const analyzeFile = (file: TSXFile): AnalysisOutput => {
  const ast = parseAST(file);

  return Object.fromEntries(
    Object.entries(analyzers).map(([key, analyzer]) => [key, analyzer(ast)])
  )
}

export const analyze = async (path: string) => {
  const analysis: AnalysisOutput[] = [];

  for await (const file of readFiles(path)) {
    analysis.push(analyzeFile(file));
  }

  return analysis;
}