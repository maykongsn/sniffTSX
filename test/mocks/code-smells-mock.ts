export const mockAnyType = {
  path: 'test/components/Any.tsx',
  content: 'import React from "react";\n' +
    '\n' +
    'type MyType = Array<any>;\n' +
    'type Other = string | any;\n' +
    '\n' +
    'export function Any(props: any) {\n' +
    '  return (\n' +
    '    <div>\n' +
    '      {...props}\n' +
    '    </div>\n' +
    '  )\n' +
    '}'
}

export const mockNonNullAssertions = {
  path: 'test/components/NonNull.tsx',
  content: 'import React from "react";\n' +
    '\n' +
    'interface Data {\n' +
    '  prop1: string;\n' +
    '  prop2: number;\n' +
    '}\n' +
    '\n' +
    'interface Props {\n' +
    '  data: Data | null;\n' +
    '}\n' +
    '\n' +
    'export function Component({ data }: Props): JSX.Element {\n' +
    '  return(\n' +
    '    <div>\n' +
    '      <p>{data!.prop1}</p>\n' +
    '      <p>Teste</p>\n' +
    '      <p>{data!.prop2}</p>\n' +
    '      <h1>Testando</h1>\n' +
    '    </div>\n' +
    '  )\n' +
    '}'
}

export const mockMissingUnionTypeAbstraction = {
  path: 'test/components/MissingUnion.tsx',
  content: 'const ShapeComponent = () => {\n' +
    '  const [current, setCurrent] = \n' +
    "    useState<'circle' | 'square'>('circle');\n" +
    '\n' +
    "  function changeShape(type: 'circle' | 'square') {\n" +
    '    // ...\n' +
    '  }\n' +
    '\n' +
    "  function calculateArea(type: 'circle' | 'square') {\n" +
    '    // ...\n' +
    '  }\n' +
    '}'
}