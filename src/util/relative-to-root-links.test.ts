import relativeToRootLinks from './relative-to-root-links';

it('transforms sibling-level links', () => {
  const rootUrl = relativeToRootLinks('./args.md', '/docs/writing-stories/introduction');
  expect(rootUrl).toEqual('/docs/writing-stories/args');
});

it('transforms parent-level links', () => {
  const rootUrl = relativeToRootLinks(
    '../writing-docs/introduction.md',
    '/docs/writing-stories/introduction'
  );
  expect(rootUrl).toEqual('/docs/writing-docs/introduction');
});

it('transforms specific-version links', () => {
  const rootUrl = relativeToRootLinks(
    '../../../release-6-5/docs/api/csf.md',
    '/docs/configure/babel'
  );
  expect(rootUrl).toEqual('/docs/6.5/api/csf');
});

it('does not transform non-versioned upper-level links', () => {
  const rootUrl = relativeToRootLinks(
    '../../foo/bar/README.md',
    '/docs/writing-stories/introduction'
  );
  expect(rootUrl).toEqual('../../foo/bar/README.md');

  const rootUrl2 = relativeToRootLinks(
    '../../../foo/bar/README.md',
    '/docs/writing-stories/introduction'
  );
  expect(rootUrl2).toEqual('../../../foo/bar/README.md');
});

it('does not transform non-relative links', () => {
  const rootUrl = relativeToRootLinks('/foo', '/docs/writing-stories/introduction');
  expect(rootUrl).toEqual('/foo');
});
