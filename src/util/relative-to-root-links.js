const buildPathWithVersion = require('./build-path-with-version');

function removeMdExtension(path) {
  return path.replace(/\.md$/, '');
}

/**
 * Convert relative links in docs to relative but from the /docs root
 *
 * ./docs-page with path docs/writing-docs/introduction becomes /docs/writing-docs/docs-page
 * ../addons/writing-addons becomes /docs/addons/writing-addons
 * ../../../release-6-5/docs/api/csf.md becomes /docs/6.5/api/csf
 *
 * ../../app/ember/README.md remains untouched (these are converted to github links elsewhere)
 * /addons remains untouched
 */
function relativeToRootLinks(href, path = '') {
  const relativeUrlRegex = /^(?!\.\.\/\.\.\/)(\.\/)(.*)$/;
  const multiLevelRelativeUrlRegex = /^(?!\.\.\/\.\.\/)(\.\.\/)(.*)$/;

  let url = href;

  const versionedUrl = url.match(/\/release-(\d+-\d+)\//);
  if (versionedUrl) {
    // rewrite ../../../release-#-#/docs/parent/some-path style urls to /docs/version/parent/some-path
    const overrideVersion = versionedUrl[1].split('-').join('.');
    url = buildPathWithVersion(href.replace(/.*\/docs\/(.*)/, '/docs/$1'), overrideVersion);
    return removeMdExtension(url);
  }

  if (relativeUrlRegex.test(href)) {
    // rewrite ./some-path style urls to /docs/version?/parent/some-path
    const slugParts = path.split('/').filter((p) => !!p);
    slugParts.splice(-1, 1, href.replace(relativeUrlRegex, '$2'));
    url = `/${slugParts.join('/')}`;
    return removeMdExtension(url);
  }

  if (multiLevelRelativeUrlRegex.test(href)) {
    // rewrite ../parent/some-path style urls to /docs/version?/parent/some-path
    url = buildPathWithVersion(href.replace(multiLevelRelativeUrlRegex, '/docs/$2'));
    return removeMdExtension(url);
  }

  return url;
}

module.exports = relativeToRootLinks;
