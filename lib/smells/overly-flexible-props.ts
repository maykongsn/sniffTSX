import { ParseResult } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { File, TSType, Identifier, Pattern, RestElement, ArrowFunctionExpression, FunctionDeclaration } from "@babel/types";
import { SourceLocation } from "../types";

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
  param: Identifier | Pattern | RestElement,
  propsDefinitions: string[]
) => {
  const typeName = param?.typeAnnotation?.typeAnnotation.typeName?.name;
  return typeName && propsDefinitions.includes(typeName);
}

const usesPropsFlexibleDirectly = (param: Identifier | Pattern | RestElement) => {
  const typeAnnotation = param?.typeAnnotation?.typeAnnotation;
  return typeAnnotation && isFlexibleObject(typeAnnotation);
}

const checkComponentPropsUsage = (
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression>,
  propsDefinitions: string[],
  components: SourceLocation[]
) => {
  if (
    isComponentPropsFlexible(path.node.params[0], propsDefinitions) ||
    usesPropsFlexibleDirectly(path.node.params[0])
  ) {
    components.push({
      start: path.node.loc?.start.line,
      end: path.node.loc?.end.line
    });
  }
}

export const overlyFlexibleProps = (ast: ParseResult<File>) => {
  const propsDefinitions: string[] = [];
  const components: SourceLocation[] = [];

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

    FunctionDeclaration(path) {
      checkComponentPropsUsage(path, propsDefinitions, components);
    },

    ArrowFunctionExpression(path) {
      checkComponentPropsUsage(path, propsDefinitions, components);
    },
  });

  return components;
}