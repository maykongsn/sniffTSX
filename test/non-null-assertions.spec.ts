import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockNonNullAssertions } from "./mocks/code-smells-mock";
import { nonNullAssertions } from "../lib/smells/non-null-assertions";

describe("Non-Null Assertions", () => {
  test("should return two occurrences of Non-Null Assertions", () => {
    const expectedOutput = [
      { start: 15, end: 15, filename: 'test/components/NonNull.tsx' },
      { start: 17, end: 17, filename: 'test/components/NonNull.tsx' }
    ];

    const ast = parseAST(mockNonNullAssertions);

    expect(nonNullAssertions(ast)).toEqual(expectedOutput);
  });
});