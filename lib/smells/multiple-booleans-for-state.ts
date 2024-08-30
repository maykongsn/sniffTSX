import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File, isBooleanLiteral } from "@babel/types";
import { SourceLocation } from "../types";

export const multipleBooleansForState = (ast: ParseResult<File>) => {
  return new Promise((resolve) => {
    const states: SourceLocation[] = [];
  
    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type === "Identifier" || path.node.callee.type === "MemberExpression" &&
          path.node.callee.name === "useState" &&
          path.node.arguments.length > 0 &&
          isBooleanLiteral(path.node.arguments[0])
        ) {
          states.push({
            start: path.node.callee.loc?.start.line,
            end: path.node.callee.loc?.end.line,
            filename: path.node.callee.loc?.filename
          });
        }
      }
    });
  
    resolve(states.length > 4 ? states : [])
  })
}