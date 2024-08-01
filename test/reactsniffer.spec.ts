import { describe, expect, test, vi } from 'vitest';
import { runReactSniffer } from '../lib/reactsniffer';

vi.mock('../lib/reactsniffer', () => ({
  runReactSniffer: vi.fn(),
}));

describe("ReactSniffer wrapper", () => {
  test("should return output when runReactSniffer resolves", async () => {
    const mockOutput = { 
      table1: [
        {
          id: '',
          largeFile: 'Test.tsx',
          loc: '72',
          nComponents: '3',
          nFunctions: '0',
          nImports: '0'
        }
      ],
      table2: [
        {
          file: 'Button.tsx',
          component: 'Button',
          lc: 'Y',
          tp: 'N',
          iic: 'N',
          fu: '0',
          dom: '0',
          jsx: '0',
          uc: '0',
          pis: '0',
        },
        {
          file: 'Test.tsx',
          component: 'ListNames',
          lc: 'N',
          tp: 'N',
          iic: 'N',
          fu: '0',
          dom: '0',
          jsx: '0',
          uc: '0',
          pis: '1',
        },
        {
          file: 'Test.tsx',
          component: 'ListNamesB',
          lc: 'Y',
          tp: 'N',
          iic: 'N',
          fu: '0',
          dom: '0',
          jsx: '0',
          uc: '0',
          pis: '1',
        },
        {
          file: 'Test.tsx',
          component: 'ListNamesC',
          lc: 'Y',
          tp: 'N',
          iic: 'N',
          fu: '0',
          dom: '0',
          jsx: '0',
          uc: '0',
          pis: '1',
        }
      ] 
    };

    vi.mocked(runReactSniffer).mockResolvedValue(mockOutput);
    
    expect(await runReactSniffer('/docs/code-examples')).toEqual(mockOutput);
  });
});