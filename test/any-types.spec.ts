import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockAnyType } from "./mocks/any-type-mock";
import { anyType } from "../lib/smells/any-type";

describe("Any type", () => {
  test("should return tree occurrences of any type", () => {
    const expectedOutput = [
      { start: 3, end: 3, filename: 'test/components/Any.tsx' },
      { start: 4, end: 4, filename: 'test/components/Any.tsx' },
      { start: 6, end: 6, filename: 'test/components/Any.tsx' }
    ];
    
    const ast = parseAST(mockAnyType);
    
    expect(anyType(ast)).toEqual(expectedOutput);
  });
});