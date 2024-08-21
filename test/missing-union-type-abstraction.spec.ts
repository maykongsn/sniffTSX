import { describe, expect, test } from "vitest";
import { parseAST } from "../lib/utils/parser";
import { mockMissingUnionTypeAbstraction } from "./mocks/code-smells-mock";
import { missingUnionTypeAbstraction } from "../lib/smells/missing-union-type-abstraction";

describe("Missing Union Type Abstraction", () => {
  test("should return an occurrence of Missing Union Type Abstraction", () => {
    const expectedOutput = [
      {
        members: [ 'circle', 'square' ],
        start: 3,
        end: 3,
        filename: 'test/components/MissingUnion.tsx'
      },
      {
        members: [ 'circle', 'square' ],
        start: 5,
        end: 5,
        filename: 'test/components/MissingUnion.tsx'
      },
      {
        members: [ 'circle', 'square' ],
        start: 9,
        end: 9,
        filename: 'test/components/MissingUnion.tsx'
      }
    ];

    const ast = parseAST(mockMissingUnionTypeAbstraction);

    expect(missingUnionTypeAbstraction(ast)).toEqual(expectedOutput);
  });
});