import { describe, expect, test, vi } from 'vitest';
import { runReactSniffer } from '../lib/reactsniffer';

describe.skip("ReactSniffer wrapper", () => {
  test("should return output when runReactSniffer resolves", async () => {
    const mockOutput = { 
      table1: [
        {
          id: '',
          "LOC": 72,
          "Large File": "Test.tsx",
          N_Components: 3,
          N_Functions: 0,
          N_Imports: 0
        }
      ],
      table2: [
        {
          File: 'Button.tsx',
          Component: 'Button',
          LC: 'Y',
          TP: 'N',
          IIC: 'N',
          FU: 0,
          DOM: 0,
          JSX: 0,
          UC: 0,
          PIS: 0,
        },
        {
          File: 'Test.tsx',
          Component: 'ListNames',
          LC: 'N',
          TP: 'N',
          IIC: 'N',
          FU: 0,
          DOM: 0,
          JSX: 0,
          UC: 0,
          PIS: 1,
        },
        {
          File: 'Test.tsx',
          Component: 'ListNamesB',
          LC: 'N',
          TP: 'N',
          IIC: 'N',
          FU: 0,
          DOM: 0,
          JSX: 0,
          UC: 0,
          PIS: 1,
        },
        {
          File: 'Test.tsx',
          Component: 'ListNamesC',
          LC: 'N',
          TP: 'N',
          IIC: 'N',
          FU: 0,
          DOM: 0,
          JSX: 0,
          UC: 0,
          PIS: 1,
        }
      ] 
    };

    expect(await runReactSniffer('test/components')).toEqual(mockOutput);
  });
});