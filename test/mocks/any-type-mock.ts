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