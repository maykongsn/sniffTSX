import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { SourceLocation } from "../types";

export const enumImplicitValues = (ast: ParseResult<File>): Promise<SourceLocation[]> => {
  return new Promise((resolve) => {
    const enums: SourceLocation[] = [];
    
    traverse(ast, {
      TSEnumDeclaration(path) {
        const hasAllMembersWithConstants = path.node.members.every((member) => member.initializer);
  
        if(!hasAllMembersWithConstants) {
          enums.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line,
            filename: path.node.loc?.filename
          });
        }
      }
    });
    resolve(enums);
  });
  
}