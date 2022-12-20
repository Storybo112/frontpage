const buildPathWithFramework = require('./build-path-with-framework');

/**
 *
 * Convert relative links in docs to relative but from the /docs root
 *
 * ./docs-page with path docs/react/writing-docs/introduction becomes /docs/react/writing-docs/docs-page
 * ../addons/writing-addons becomes /docs/react/addons/writing-addons
 * ../../app/ember/README remain untouched (these are converted to github links elsewhere)
 * /addons remains untouched
 */
function relativeToRootLinks(href, framework, path = '', version) {
  const relativeUrlRegex = /^(?!\.\.\/\.\.\/)(\.\/)(.*)$/;
  const multiLevelRelativeUrlRegex = /^(?!\.\.\/\.\.\/)(\.\.\/)(.*)$/;

  let url = href;

  if (relativeUrlRegex.test(href)) {
    // rewrite ./some_path style urls to /docs/version/framework/parent/some_path
    const slugParts = path.split('/').filter((p) => !!p);
    slugParts.splice(-1, 1, href.replace(relativeUrlRegex, '$2'));

    if (version) {
      slugParts.splice(1, 0, version);
    }

    url = `/${slugParts.join('/')}`;
  } else if (multiLevelRelativeUrlRegex.test(href)) {
    // rewrite ../some_path style urls to /docs/version/framework/some_path
    url = buildPathWithFramework(
      href.replace(multiLevelRelativeUrlRegex, '/docs/$2'),
      framework,
      version
    );
  }

  return url;
}

module.exports = relativeToRootLinks;
