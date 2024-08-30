import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { SourceLocation } from "../types";
import { TSType } from "@babel/types";

type Union = {
  members: string[];
} & SourceLocation;

const findTypeNode = (typeNodes: TSType[]) =>
  typeNodes.find((typeNode) =>
    typeNode.literal ?? (typeNode.type === "TSTypeReference" ? typeNode.typeName : typeNode)
  )?.loc

// TODO: correct types for literal and reference nodes
const typeLiteralHandler = (typeNode: TSType): string => typeNode.literal.value;  
const typeReferenceHandler = (typeNode: TSType): string => typeNode.typeName.name;
const defaultHandler = (typeNode: TSType) => typeNode.type;

const handlers: { [key: string]: (typeNode: TSType) => string } = {
  TSTypeReference: typeReferenceHandler,
  TSLiteralType: typeLiteralHandler,
};

const mapMember = (typeNode: TSType) => {
  return (handlers[typeNode.type] ?? defaultHandler)(typeNode);
}

export const missingUnionTypeAbstraction = (ast: ParseResult<File>): Promise<SourceLocation[]> => {
  return new Promise((resolve) => {
    const unionTypes: Union[] = [];
  
    const membersCount: Record<string, number> = {};
  
    traverse(ast, {
      TSUnionType(path) {
        const loc = findTypeNode(path.node.types);
  
        unionTypes.push({
          members: path.node.types.map(mapMember),
          start: loc?.start.line,
          end: loc?.end.line,
          filename: loc?.filename
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
  
      resolve(hasThreeOrMoreDuplicatedUnions ? unionTypes : []);
    }
  
    resolve([]);

  })
}