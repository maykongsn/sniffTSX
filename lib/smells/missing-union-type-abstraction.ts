import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { SourceLocation } from "../types";

type Union = {
  members: string[];
} & SourceLocation;

export const missingUnionTypeAbstraction = (ast: ParseResult<File>) => {
  const unionTypes: Union[] = [];

  const membersCount: Record<string, number> = {};

  traverse(ast, {
    TSUnionType(path) {
      unionTypes.push({
        members: path.node.types.map((typeNode) => {
          if (typeNode.literal) {
            return typeNode.literal.value
          }

          return typeNode.type === "TSTypeReference" ? typeNode.typeName.name : typeNode.type
        }),
        start: path.node.types.find((typeNode) => {
          if(typeNode.literal) {
            return typeNode.literal.loc.start.line;
          }

          return typeNode.type === "TSTypeReference" ? typeNode.typeName.loc?.start.line : typeNode.loc?.start.line;
        })?.loc?.start.line,
        end: path.node.types.find((typeNode) => {
          if(typeNode.literal) {
            return typeNode.literal.loc.end.line;
          }

          return typeNode.type === "TSTypeReference" ? typeNode.typeName.loc?.end.line : typeNode.loc?.end.line;
        })?.loc?.start.line,
        filename: path.node.types.find((typeNode) => {
          if(typeNode.literal) {
            return typeNode.literal.loc.filename;
          }

          return typeNode.type === "TSTypeReference" ? typeNode.typeName.loc?.filename : typeNode.loc?.filename;
        })?.loc?.filename
      });
    }
  });

  if (unionTypes.length >= 3) {
    unionTypes.forEach((union) => {
      const normalizedMembers = union.members.sort();
      const key = normalizedMembers.join("|");
      membersCount[key] = (membersCount[key] ?? 0) + 1;
    })

    const hasThreeOrMoreDuplicatedUnions = Object.values(membersCount).some(count => count >= 3)

    return hasThreeOrMoreDuplicatedUnions ? unionTypes : [];
  }

  return [];
}