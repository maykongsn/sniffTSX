import { ParseResult } from "@babel/parser";
import traverse from "@babel/traverse";
import { File, TSType, FunctionDeclaration, ArrowFunctionExpression } from "@babel/types";
import { SourceLocation } from "../types";

const isPropDefinitionOverlyFlexible = (
  node: ArrowFunctionExpression | FunctionDeclaration, 
  definition: string
) => {
  if (!definition) return false;

  const param = node.params[0];
  return param?.typeAnnotation?.typeAnnotation?.typeName?.name === definition;
}

export const overlyFlexibleProps = (ast: ParseResult<File>) => {
  const propsDefinitions: string[] = [];
  const components: SourceLocation[] = [];

  traverse(ast, {
    TSTypeAliasDeclaration(path) {
      if (
        path.node.typeAnnotation.type === "TSTypeReference" &&
        path.node.typeAnnotation.typeName.name === "Record" &&
        path.node.typeAnnotation.typeParameters?.params[0].type === "TSStringKeyword" &&
        path.node.typeAnnotation.typeParameters?.params[1].type === "TSUnknownKeyword"
      ) {
        propsDefinitions.push(path.node.id.name);
      }

      if (
        path.node.typeAnnotation.type === "TSIntersectionType" &&
        path.node.typeAnnotation.types.some((node: TSType) =>
          node.type === "TSTypeReference" &&
          node.typeName.name === "Record" &&
          node.typeParameters?.params[0].type === "TSStringKeyword" &&
          node.typeParameters?.params[1].type === "TSUnknownKeyword"
        )
      ) {
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

    ArrowFunctionExpression(path) {
      const foundTypeAlias = propsDefinitions.find((definition) => isPropDefinitionOverlyFlexible(path.node, definition));

      if (foundTypeAlias) {
        components.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
          filename: path.node.loc?.filename
        });
      }

      path.node.params.forEach((param) => {
        if (
          param.typeAnnotation?.typeAnnotation.type === "TSTypeReference" &&
          param.typeAnnotation?.typeAnnotation.typeName.name === "Record" &&
          param.typeAnnotation?.typeAnnotation.typeParameters?.params[0].type === "TSStringKeyword" &&
          param.typeAnnotation?.typeAnnotation.typeParameters?.params[1].type === "TSUnknownKeyword"
        ) {
          components.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line,
            filename: path.node.loc?.filename
          });
        }
        if (
          param.typeAnnotation?.typeAnnotation.type === "TSIntersectionType" &&
          param.typeAnnotation?.typeAnnotation.types.some((node: TSType) =>
            node.type === "TSTypeReference" &&
            node.typeName.name === "Record" &&
            node.typeParameters?.params[0].type === "TSStringKeyword" &&
            node.typeParameters?.params[1].type === "TSUnknownKeyword"
          )
        ) {
          components.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line,
            filename: path.node.loc?.filename
          });
        }
      });
    },

    FunctionDeclaration(path) {
      const foundTypeAlias = propsDefinitions.find((definition) => isPropDefinitionOverlyFlexible(path.node, definition));

      if (foundTypeAlias) {
        components.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
          filename: path.node.loc?.filename
        });
      }

      path.node.params.forEach((param) => {
        if (
          param.typeAnnotation?.typeAnnotation.type === "TSTypeReference" &&
          param.typeAnnotation?.typeAnnotation.typeName.name === "Record" &&
          param.typeAnnotation?.typeAnnotation.typeParameters?.params[0].type === "TSStringKeyword" &&
          param.typeAnnotation?.typeAnnotation.typeParameters?.params[1].type === "TSUnknownKeyword"
        ) {
          components.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line,
            filename: path.node.loc?.filename
          });
        }

        if (
          param.typeAnnotation?.typeAnnotation.type === "TSIntersectionType" &&
          param.typeAnnotation?.typeAnnotation.types.some((node: TSType) =>
            node.type === "TSTypeReference" &&
            node.typeName.name === "Record" &&
            node.typeParameters?.params[0].type === "TSStringKeyword" &&
            node.typeParameters?.params[1].type === "TSUnknownKeyword"
          )
        ) {
          components.push({
            start: path.node.loc?.start.line,
            end: path.node.loc?.end.line,
            filename: path.node.loc?.filename
          });
        }
      });
    },
  });

  return components;
}