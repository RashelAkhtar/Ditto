import { describe, it, expect } from 'vitest';

import { parseGitHubUrl } from '../src/Validators/analysis.validator.js';

/**
 * parseGitHubUrl is the one piece of /analyze worth exhaustive testing: it is
 * the gate between arbitrary pasted text and a repo we will spend money to fetch.
 */

describe('parseGitHubUrl', () => {
  describe('repository URLs', () => {
    it('parses a plain repo URL', () => {
      expect(parseGitHubUrl('https://github.com/cline/cline')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
      });
    });

    it('accepts a trailing slash', () => {
      expect(parseGitHubUrl('https://github.com/cline/cline/')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
      });
    });

    it('accepts the www.github.com host', () => {
      expect(parseGitHubUrl('https://www.github.com/cline/cline')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
      });
    });

    it('accepts the www.github.com host with a trailing slash', () => {
      expect(parseGitHubUrl('https://www.github.com/cline/cline/')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
      });
    });

    it('strips a trailing .git', () => {
      expect(parseGitHubUrl('https://github.com/facebook/react.git')).toEqual({
        owner: 'facebook',
        name: 'react',
        ref: null,
      });
    });

    it('accepts a .git suffix with www.github.com', () => {
      expect(parseGitHubUrl('https://www.github.com/facebook/react.git')).toEqual({
        owner: 'facebook',
        name: 'react',
        ref: null,
      });
    });

    it('accepts a .git suffix with a trailing slash', () => {
      expect(parseGitHubUrl('https://github.com/facebook/react.git/')).toEqual({
        owner: 'facebook',
        name: 'react',
        ref: null,
      });
    });
  });

  describe('pull request URLs', () => {
    it('parses a plain pull request URL', () => {
      expect(parseGitHubUrl('https://github.com/cline/cline/pull/123')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
        prNumber: 123,
      });
    });

    it('accepts a .git suffix on a pull request URL', () => {
      expect(parseGitHubUrl('https://github.com/cline/cline.git/pull/123')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
        prNumber: 123,
      });
    });

    it('accepts a trailing slash on a pull request URL', () => {
      expect(parseGitHubUrl('https://github.com/cline/cline/pull/123/')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
        prNumber: 123,
      });
    });

    it('accepts the www.github.com host on a pull request URL', () => {
      expect(parseGitHubUrl('https://www.github.com/cline/cline/pull/123')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
        prNumber: 123,
      });
    });

    it('accepts all supported variations on a pull request URL', () => {
      expect(parseGitHubUrl('https://www.github.com/cline/cline.git/pull/123/')).toEqual({
        owner: 'cline',
        name: 'cline',
        ref: null,
        prNumber: 123,
      });
    });
  });

  describe('repository references', () => {
    it('extracts the branch from a /tree/<ref> URL', () => {
      expect(parseGitHubUrl('https://github.com/actualbudget/actual/tree/master')).toEqual({
        owner: 'actualbudget',
        name: 'actual',
        ref: 'master',
      });
    });

    it('extracts the sha from a /commit/<ref> URL', () => {
      expect(parseGitHubUrl('https://github.com/o/r/commit/abc123')).toMatchObject({
        owner: 'o',
        name: 'r',
        ref: 'abc123',
      });
    });
  });

  describe('invalid URLs', () => {
    it('rejects a non-github host', () => {
      expect(() => parseGitHubUrl('https://gitlab.com/o/r')).toThrow(/github\.com/i);
    });

    it('rejects text that is not a URL', () => {
      expect(() => parseGitHubUrl('cline/cline')).toThrow(/valid URL/i);
    });

    it('rejects a URL with no repo name', () => {
      expect(() => parseGitHubUrl('https://github.com/cline')).toThrow(/owner\/repo/i);
    });

    it('rejects a github site path that is not a repo', () => {
      expect(() => parseGitHubUrl('https://github.com/orgs/anthropics')).toThrow(/owner\/repo/i);
    });

    it('rejects a non-https scheme', () => {
      expect(() => parseGitHubUrl('ftp://github.com/o/r')).toThrow();
    });
  });
});
