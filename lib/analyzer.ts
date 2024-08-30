import { readFiles } from "./utils/file-reader";
import { parseAST } from "./utils/parser";
import { SourceLocation } from "./types";

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

export const analyze = async (path: string) => {
  const analysis: AnalysisOutput[] = [];

  for await (const file of readFiles(path)) {
    const ast = parseAST(file);

    const [
      anyTypeOccurrences,
      nonNullAssertionsOccurrences,
      missingUnionTypeAbstractionOccurrences,
      enumImplicitValuesOccurrences,
      multipleBooleansForStateOccurrences,
      overlyFlexiblePropsOccurrences,
    ] = await Promise.all([
      anyType(ast),
      nonNullAssertions(ast),
      missingUnionTypeAbstraction(ast),
      enumImplicitValues(ast),
      multipleBooleansForState(ast),
      overlyFlexibleProps(ast),
    ]);

    analysis.push({
      anyType: anyTypeOccurrences,
      nonNullAssertions: nonNullAssertionsOccurrences,
      missingUnionTypeAbstraction: missingUnionTypeAbstractionOccurrences,
      enumImplicitValues: enumImplicitValuesOccurrences,
      multipleBooleansForState: multipleBooleansForStateOccurrences,
      overlyFlexibleProps: overlyFlexiblePropsOccurrences,
    });
  }

  return analysis;
}