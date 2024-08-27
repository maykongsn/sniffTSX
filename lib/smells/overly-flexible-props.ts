import { ParseResult } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { File, TSType, Identifier, Pattern, RestElement, ArrowFunctionExpression, FunctionDeclaration } from "@babel/types";
import { SourceLocation } from "../types";

const propsDefinitions: string[] = [];
const components: SourceLocation[] = [];

const isFlexibleObject = (typeAnnotation: TSType) => {
  if (typeAnnotation.type === "TSIntersectionType") {
    return typeAnnotation.types.some((node: TSType) =>
      node.type === "TSTypeReference" &&
      node.typeName.name === "Record" &&
      node.typeParameters?.params[0].type === "TSStringKeyword" &&
      node.typeParameters?.params[1].type === "TSUnknownKeyword"
    );
  }

  return typeAnnotation.type === "TSTypeReference" &&
    typeAnnotation.typeName.name === "Record" &&
    typeAnnotation.typeParameters?.params[0].type === "TSStringKeyword" &&
    typeAnnotation.typeParameters?.params[1].type === "TSUnknownKeyword";
};

const isComponentPropsFlexible = (
  param: Identifier | Pattern | RestElement
) => {
  const typeName = param?.typeAnnotation?.typeAnnotation.typeName?.name;
  return typeName && propsDefinitions.includes(typeName);
}

const usesPropsFlexibleDirectly = (param: Identifier | Pattern | RestElement) => {
  const typeAnnotation = param?.typeAnnotation?.typeAnnotation;
  return typeAnnotation && isFlexibleObject(typeAnnotation);
}

const checkComponentPropsUsage = (
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression>
) => {
  if (
    isComponentPropsFlexible(path.node.params[0]) || 
    usesPropsFlexibleDirectly(path.node.params[0])
  ) {
    components.push({
      start: path.node.loc?.start.line,
      end: path.node.loc?.end.line,
      filename: path.node.loc?.filename
    });
  }
}

export const overlyFlexibleProps = (ast: ParseResult<File>) => {
  traverse(ast, {
    TSTypeAliasDeclaration(path) {
      if (isFlexibleObject(path.node.typeAnnotation)) {
        propsDefinitions.push(path.node.id.name);
      }
    },

    TSInterfaceDeclaration(path) {
      if (
        path.node.extends?.some((extend) =>
          extend.expression.type === "Identifier" &&
          extend.expression.name === "Record" &&
          extend.typeParameters?.params[0].type === "TSStringKeyword" &&
          extend.typeParameters?.params[1].type === "TSUnknownKeyword"
        )
      ) {
        propsDefinitions.push(path.node.id.name);
      }
    },

    FunctionDeclaration: checkComponentPropsUsage,
    ArrowFunctionExpression: checkComponentPropsUsage,
  });

  return components;
}