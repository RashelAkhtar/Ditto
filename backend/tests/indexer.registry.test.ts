import { describe, it, expect } from 'vitest';
import { adapterFor, isAnySourceFile } from '../src/Services/indexer/language/registry.ts';
import { tsMorphAdapter } from '../src/Services/indexer/language/adapter.ts';
import { pythonAdapter } from '../src/Services/indexer/language/python/adapter.ts';

describe('Language Registry - adapterFor', () => {
  it('routes Python files to the Python adapter', () => {
    expect(adapterFor('foo.py')).toBe(pythonAdapter);
  });

  it('routes TypeScript and JavaScript files to the ts-morph adapter', () => {
    expect(adapterFor('foo.ts')).toBe(tsMorphAdapter);
    expect(adapterFor('foo.js')).toBe(tsMorphAdapter);
    expect(adapterFor('foo.tsx')).toBe(tsMorphAdapter);
  });

  it('returns null for unsupported file types', () => {
    expect(adapterFor('README.md')).toBeNull();
    expect(adapterFor('unknown.xyz')).toBeNull();
  });

  it('routes Python and Typescript files to different adapters', () => {
    expect(adapterFor('foo.py')).not.toBe(adapterFor('foo.ts'));
  });
});

describe('Language Registry - isAnySourceFile', () => {
  it('returns true for supported source files', () => {
    expect(isAnySourceFile('foo.py')).toBe(true);
    expect(isAnySourceFile('foo.ts')).toBe(true);
  });

  it('returns false for non-source files', () => {
    expect(isAnySourceFile('README.md')).toBe(false);
    expect(isAnySourceFile('unknown.xyz')).toBe(false);
  });
});
