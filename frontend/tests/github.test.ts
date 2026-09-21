import { describe, it, expect } from 'vitest';

import {
  parseGitHubRepo,
  parsePullRequest,
} from '@/lib/github';

describe('parseGitHubRepo', () => {
  it('parses a bare GitHub repository URL', () => {
    expect(parseGitHubRepo('https://github.com/owner/repo')).toEqual({
      owner: 'owner',
      name: 'repo',
    });
  });

  it('accepts a .git suffix', () => {
    expect(parseGitHubRepo('https://github.com/owner/repo.git')).toEqual({
      owner: 'owner',
      name: 'repo',
    });
  });

  it('accepts a trailing slash', () => {
    expect(parseGitHubRepo('https://github.com/owner/repo/')).toEqual({
      owner: 'owner',
      name: 'repo',
    });
  });

  it('accepts the www.github.com host', () => {
    expect(parseGitHubRepo('https://www.github.com/owner/repo')).toEqual({
      owner: 'owner',
      name: 'repo',
    });
  });
});

describe('parsePullRequest', () => {
  it('parses a bare pull request URL', () => {
    expect(parsePullRequest('https://github.com/owner/repo/pull/123')).toEqual({
      owner: 'owner',
      name: 'repo',
      prNumber: 123,
    });
  });

  it('accepts a .git suffix on the repository name', () => {
    expect(parsePullRequest('https://github.com/owner/repo.git/pull/123')).toEqual({
      owner: 'owner',
      name: 'repo',
      prNumber: 123,
    });
  });

  it('accepts a trailing slash', () => {
    expect(parsePullRequest('https://github.com/owner/repo/pull/123/')).toEqual({
      owner: 'owner',
      name: 'repo',
      prNumber: 123,
    });
  });

  it('accepts the www.github.com host', () => {
    expect(parsePullRequest('https://www.github.com/owner/repo/pull/123')).toEqual({
      owner: 'owner',
      name: 'repo',
      prNumber: 123,
    });
  });
});