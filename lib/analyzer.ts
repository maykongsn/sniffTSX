import { readFiles } from "./utils/file-reader";
import { parseAST } from "./utils/parser";

import { anyType } from "./smells/any-type";
import { enumImplicitValues } from "./smells/enum-implicit-values";
import { missingUnionTypeAbstraction } from "./smells/missing-union-type-abstraction";
import { multipleBooleansForState } from "./smells/multiple-booleans-for-state";
import { nonNullAssertions } from "./smells/non-null-assertions";
import { overlyFlexibleProps } from "./smells/overly-flexible-props";

export const analyze = async (path: string) => {
  for await (const file of readFiles(path)) {
    const ast = parseAST(file);

    const result = await Promise.all([
      anyType(ast),
      nonNullAssertions(ast),
      missingUnionTypeAbstraction(ast),
      enumImplicitValues(ast),
      multipleBooleansForState(ast),
      overlyFlexibleProps(ast),
    ]);

    console.log(result)
  }
}