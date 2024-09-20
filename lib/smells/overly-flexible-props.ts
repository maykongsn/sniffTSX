import { ParseResult } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { 
  File, 
  TSType, 
  Identifier, 
  Pattern, 
  RestElement, 
  ArrowFunctionExpression, 
  FunctionDeclaration, 
  isIdentifier, 
  isTSQualifiedName, 
  TypeAnnotation, 
  TSTypeAnnotation, 
  Noop 
} from "@babel/types";
import { SourceLocation } from "../types";

const isFlexibleObject = (typeAnnotation: TSType) => {
  if (typeAnnotation.type === "TSIntersectionType") {
    return typeAnnotation.types.some(
      (node: TSType) =>
        node.type === "TSTypeReference" &&
        (isIdentifier(node.typeName)
          ? node.typeName.name === "Record"
          : isTSQualifiedName(node.typeName) &&
          isIdentifier(node.typeName.left) &&
          node.typeName.left.name === "Record") &&
        node.typeParameters?.params[0].type === "TSStringKeyword" &&
        node.typeParameters?.params[1].type === "TSUnknownKeyword"
    );
  }

  return typeAnnotation.type === "TSTypeReference" &&
    (isIdentifier(typeAnnotation.typeName)
      ? typeAnnotation.typeName.name === "Record"
      : isTSQualifiedName(typeAnnotation.typeName) &&
      isIdentifier(typeAnnotation.typeName.left) &&
      typeAnnotation.typeName.left.name === "Record") &&
    typeAnnotation.typeParameters?.params[0].type === "TSStringKeyword" &&
    typeAnnotation.typeParameters?.params[1].type === "TSUnknownKeyword";
};

const nestedTypeAnnotation = (
  typeAnnotation: 
    | TypeAnnotation 
    | TSTypeAnnotation 
    | Noop 
    | null 
    | undefined
) =>
  typeAnnotation && 
  'typeAnnotation' in typeAnnotation
    ? typeAnnotation.typeAnnotation
    : null;

const isPropsUsingFlexibleRecordType = (
  param: 
    | Identifier 
    | Pattern 
    | RestElement,
  propsDefinitions: string[]
) => {
  const typeAnnotation = nestedTypeAnnotation(param.typeAnnotation);
  
  return (
    typeAnnotation?.type === "TSTypeReference" && 
    (
      (isIdentifier(typeAnnotation.typeName) && 
        propsDefinitions.includes(typeAnnotation.typeName.name)) ||
      (isTSQualifiedName(typeAnnotation.typeName) && 
        propsDefinitions.includes(typeAnnotation.typeName.right.name))
    )
  );
}

const isPropsFlexibleInComponentDeclaration = (
  param: 
    | Identifier 
    | Pattern 
    | RestElement
) => {
  const typeAnnotation = nestedTypeAnnotation(param.typeAnnotation)

  return (
    typeAnnotation?.type === "TSIntersectionType" &&
    typeAnnotation.types.some(
      (node: TSType) => node.type === "TSTypeReference" && isFlexibleObject(node)
    )
  );
}

const checkComponentPropsUsage = (
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression>,
  propsDefinitions: string[],
  components: SourceLocation[]
) => {
  if (
    isPropsUsingFlexibleRecordType(path.node.params[0], propsDefinitions) ||
    isPropsFlexibleInComponentDeclaration(path.node.params[0])
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