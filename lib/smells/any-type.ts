import { ParseResult } from "@babel/parser";
import { File, isTSAnyKeyword } from "@babel/types";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";

export const anyType = (ast: ParseResult<File>) => {
  const locations: SourceLocation[] = [];
  
  traverse(ast, {
    enter(path) {
      if(isTSAnyKeyword(path.node)) {
        locations.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
          filename: path.node.loc?.filename
        });
      }
    }
  });

  return locations;
}