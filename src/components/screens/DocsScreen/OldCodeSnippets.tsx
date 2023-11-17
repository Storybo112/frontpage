import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { basename } from 'path';
import { styled } from '@storybook/theming';
import {
  Badge,
  CodeSnippets as DesignSystemCodeSnippets,
  Link,
  styles,
} from '@storybook/design-system';

import { CODE_SNIPPET_CLASSNAME } from '../../../constants/code-snippets';
import { DEFAULT_CODE_LANGUAGE, CODE_LANGUAGES_FULL } from '../../../constants/code-languages';
import stylizeFramework from '../../../util/stylize-renderer';
import { logSnippetInteraction } from '../../../util/custom-events';
import { useIfContext } from './If';

const siteMetadata = require('../../../../site-metadata');
const { version, latestVersion } = require('../../../util/version-data');

const { defaultFramework } = siteMetadata;

const { color, spacing, typography } = styles;

const CSF2_TO_3_UPGRADE_GUIDE_PATH = 'api/csf#upgrading-from-csf-2-to-csf-3';

const StyledCodeSnippets = styled(DesignSystemCodeSnippets)`
  &:target {
    background: linear-gradient(
      90deg,
      ${rgba(color.secondary, 0.1)} 0%,
      ${rgba(color.secondary, 0.0)} 70%
    );
    margin: -${spacing.padding.small}px;
    padding: ${spacing.padding.small}px;
  }
`;

const CodeSnippetFramework = styled.span`
  text-transform: capitalize;
`;

const StyledBadge = styled(Badge)`
  margin-left: 5px;
  padding: 4px 7px;
`;

const syntaxNameMap = {
  'stories-of': 'StoriesOf()',
  'ts-4-9': 'TS 4.9',
};

const prettifySyntax = (syntax) => {
  const mapItem = syntaxNameMap[syntax];
  if (mapItem) return mapItem;
  return syntax.toUpperCase();
};

const COMMON = 'common';

export function TabLabel({ isActive, framework, syntax }) {
  const isFrameworkSpecific = framework !== COMMON;
  const prettifiedSyntax = prettifySyntax(syntax);

  return isFrameworkSpecific ? (
    <>
      <CodeSnippetFramework>{framework}</CodeSnippetFramework>
      <StyledBadge status={isActive ? 'selected' : 'neutral'}>{prettifiedSyntax}</StyledBadge>
    </>
  ) : (
    <span>{prettifiedSyntax}</span>
  );
}

TabLabel.propTypes = {
  isActive: PropTypes.bool.isRequired,
  framework: PropTypes.string.isRequired,
  syntax: PropTypes.string.isRequired,
};

export function PureCodeSnippets(props) {
  return <StyledCodeSnippets className={CODE_SNIPPET_CLASSNAME} {...props} />;
}

const MessagingWrapper = styled.div<{ type?: 'missing' }>`
  background-color: ${(props) => (props.type === 'missing' ? '#fdf5d3' : color.bluelight)};
  padding: 10px 16px;
  border-bottom: 1px solid ${color.border};
  font-size: ${typography.size.s2}px;
  line-height: 20px;
`;

export function MissingFrameworkMessage({ currentFramework }) {
  return (
    <MessagingWrapper type="missing">
      This snippet doesn’t exist for {stylizeFramework(currentFramework)} yet.{' '}
      <Link
        href={`https://storybook.js.org/docs/${currentFramework}/contribute/new-snippets`}
        target="_blank"
        rel="noopener"
      >
        Contribute it in a PR now
      </Link>
      . In the meantime, here’s the {stylizeFramework(defaultFramework)} snippet.
    </MessagingWrapper>
  );
}

export function MissingCodeLanguageMessage({
  currentCodeLanguage,
  currentFramework,
  fallbackLanguage = 'js',
}) {
  return (
    <MessagingWrapper type="missing">
      This snippet doesn’t exist for {CODE_LANGUAGES_FULL[currentCodeLanguage]} yet.{' '}
      <Link
        href={`https://storybook.js.org/docs/${currentFramework}/contribute/new-snippets`}
        target="_blank"
        rel="noopener"
      >
        Contribute it in a PR now
      </Link>
      . In the meantime, here’s the {CODE_LANGUAGES_FULL[fallbackLanguage]} snippet.
    </MessagingWrapper>
  );
}

export function CsfMessage({
  csf2Path,
  currentFramework,
}: {
  csf2Path?: string;
  currentFramework: string;
}) {
  return (
    <MessagingWrapper>
      This example uses Component Story Format 3. Learn how to{' '}
      <Link
        href={`/docs/${currentFramework}/${CSF2_TO_3_UPGRADE_GUIDE_PATH}`}
        target="_blank"
        rel="noopener"
      >
        upgrade now
      </Link>
      {csf2Path ? (
        <>
          {' '}
          or view the old CSF2{' '}
          <Link href={`/docs/6.5/${currentFramework}/${csf2Path}`} target="_blank" rel="noopener">
            example
          </Link>
        </>
      ) : null}
      .
    </MessagingWrapper>
  );
}

function getPathsForLanguage(paths, forLanguage, { matchMDX = true } = {}) {
  return paths.filter((path) => {
    /**
     * For a path like `web-components/button-story-click-handler-args.js.mdx`,
     * capture the group `js`
     */
    const language = path.match(/\.((?:\w+-*)+)\.mdx$/)[1];

    return (
      /**
       * The language can be, among others:
       * - `js` for general JS
       * - `ts` for general TS
       * - `ts-2` or `ts-3` for Vue 2/3 TS
       * - `ts-4-9` for TS 4.9
       * - `mdx` for MDX
       * - `mdx-2` or `mdx-3` for Vue 2/3 MDX
       * This check is formulated so that `ts-4-9` does not match `ts`, but, e.g., `ts-2` does
       */
      (language === 'ts-4-9' ? language === forLanguage : language.startsWith(forLanguage)) ||
      // Also optionally match any mdx language snippet paths
      (matchMDX && language.startsWith('mdx'))
    );
  });
}

type GetResolvedPaths = (
  paths: string[],
  currentFramework: string,
  currentCodeLanguage: string,
  ifContextRenderer?: string[]
) => [string[], React.ReactNode];

export const getResolvedPaths: GetResolvedPaths = (
  paths,
  currentFramework,
  currentCodeLanguage,
  ifContextRenderer = []
) => {
  let message;

  const isPackageManagerSnippet = paths.some(
    (path) => path.includes('.npm.') || path.includes('.yarn.')
  );

  let completePaths = paths;
  if (version >= 7 && !isPackageManagerSnippet) {
    // add TS 4.9 snippets
    completePaths = paths.flatMap((path) =>
      path.includes('.ts.') ? [path, path.replace('.ts.', '.ts-4-9.')] : [path]
    );
  }

  const pathsByFramework = completePaths.reduce((acc, path) => {
    const [framework] = path.split('/');
    if (!acc[framework]) acc[framework] = [];
    acc[framework].push(path);
    return acc;
  }, {} as Record<string, string[]>);

  let pathsForRelevantFramework =
    pathsByFramework[currentFramework] || pathsByFramework[COMMON] || [];

  if (pathsForRelevantFramework.length === 0) {
    /*
     * CodeSnippets can be rendered inside an If block. When building the page, that If block renders
     * its contents regardless of the current renderer, which can result in no relevant paths being
     * found. In that case, we attempt to find paths for the renderers configured for the parent If
     * block. This would never happen in the browser, because the If block filters its contents. But
     * it's necessary to prevent throwing an error during the build.
     */
    const rendererWithPaths = ifContextRenderer
      .filter((r) => r !== currentFramework)
      .find((r) => pathsByFramework[r]);
    if (rendererWithPaths) {
      pathsForRelevantFramework = pathsByFramework[rendererWithPaths];
    }
  }

  if (isPackageManagerSnippet) {
    return [pathsForRelevantFramework, message];
  }

  if (pathsForRelevantFramework.length === 0) {
    pathsForRelevantFramework = pathsByFramework[defaultFramework];
    message = <MissingFrameworkMessage currentFramework={currentFramework} />;
  }

  if (!pathsForRelevantFramework) {
    if (version >= latestVersion) {
      throw new Error(
        `No snippets found for ${currentFramework}${
          ifContextRenderer.length > 0 ? `or ${ifContextRenderer.join(' or ')}` : ''
        } in ${paths.join(', ')}`
      );
    }
    return [[], message];
  }

  let resolvedPaths = getPathsForLanguage(pathsForRelevantFramework, currentCodeLanguage);

  // TS selected, but no TS snippet, fallback to JS
  if (resolvedPaths.length === 0) {
    resolvedPaths = getPathsForLanguage(pathsForRelevantFramework, 'js');
    // If there are any TS snippets for other frameworks, show a message
    if (getPathsForLanguage(paths, 'ts', { matchMDX: false }).length > 0) {
      message = (
        <MissingCodeLanguageMessage
          currentCodeLanguage={currentCodeLanguage}
          currentFramework={currentFramework}
        />
      );
    }
  }

  // JS selected, but no JS snippet, fallback to TS
  if (resolvedPaths.length === 0) {
    resolvedPaths = getPathsForLanguage(pathsForRelevantFramework, DEFAULT_CODE_LANGUAGE);
    // If there are any JS snippets for other frameworks, show a message
    if (getPathsForLanguage(paths, 'js', { matchMDX: false }).length > 0) {
      message = (
        <MissingCodeLanguageMessage
          currentCodeLanguage={currentCodeLanguage}
          currentFramework={currentFramework}
          fallbackLanguage="ts"
        />
      );
    }
  }

  // JS or TS selected, but no JS or TS snippet, fallback to anything available
  if (resolvedPaths.length === 0) {
    resolvedPaths = pathsForRelevantFramework;
    message = undefined;
  }

  if (resolvedPaths.length === 0) {
    if (version >= latestVersion) {
      throw new Error(
        // prettier-ignore
        `No snippets found for ${currentFramework} and ${currentCodeLanguage} in ${paths.join(', ')}`
      );
    }
    return [[], message];
  }

  return [resolvedPaths, message];
};

export function CodeSnippets({
  csf2Path,
  currentCodeLanguage,
  currentFramework,
  paths,
  usesCsf3,
  ...rest
}) {
  const [snippets, setSnippets] = React.useState([]);

  const ifContext = useIfContext();

  const [resolvedPaths, message] = getResolvedPaths(
    paths,
    currentFramework,
    currentCodeLanguage,
    ifContext.renderer
  );

  /**
   * For a path like `web-components/button-story-click-handler-args.js.mdx`,
   * capture the group `button-story-click-handler-args`
   */
  const id = `snippet-${paths[0].match(/^(?:\w+-*)+\/((?:\w+-*)+)/)[1]}`;

  useEffect(() => {
    async function fetchModuleComponents() {
      const fetchedSnippets = await Promise.all(
        resolvedPaths.map(async (path) => {
          const [framework, fileName] = path.split('/');
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const [_, syntax] = fileName.split('.');
          // Important: this base path has to be present at the beginning of the import
          // (it cannot be a variable) because Webpack needs to know about it to make
          // sure that the MDX files are available to import.
          // See: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037

          let ModuleComponent;
          let preSnippet = message;
          try {
            ModuleComponent = (await import(`../../../content/docs/snippets/${path}`)).default;
          } catch {
            // If path is a TS 4.9 snippet and errors, try to load the TS snippet
            if (path.includes('.ts-4-9.')) {
              try {
                ModuleComponent = (
                  await import(`../../../content/docs/snippets/${path.replace('.ts-4-9.', '.ts.')}`)
                ).default;

                return {
                  id: `${framework}-${syntax}}`,
                  PreSnippet: () => (
                    <MissingCodeLanguageMessage
                      currentCodeLanguage={currentCodeLanguage}
                      currentFramework={currentFramework}
                      fallbackLanguage="ts"
                    />
                  ),
                  Snippet: ModuleComponent,
                  framework,
                  syntax: 'ts',
                  renderTabLabel: ({ isActive }) => (
                    <TabLabel framework={framework} isActive={isActive} syntax={syntax} />
                  ),
                };
              } catch {
                return null;
              }
            }
            // If path doesn't exist, don't show the snippet
            return null;
          }

          if (!preSnippet && usesCsf3) {
            preSnippet = <CsfMessage csf2Path={csf2Path} currentFramework={currentFramework} />;
          }

          return {
            id: `${framework}-${syntax}`,
            PreSnippet: preSnippet ? () => preSnippet : undefined,
            Snippet: ModuleComponent,
            framework,
            syntax,
            renderTabLabel: ({ isActive }) => (
              <TabLabel framework={framework} isActive={isActive} syntax={syntax} />
            ),
          };
        })
      );
      setSnippets(fetchedSnippets.filter((snippet) => snippet != null));
    }

    fetchModuleComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFramework]);

  if (!snippets.length) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={() => logSnippetInteraction(currentFramework, paths[0])}>
      <PureCodeSnippets snippets={snippets} id={id} {...rest} />
    </div>
  );
}

CodeSnippets.propTypes = {
  currentFramework: PropTypes.string.isRequired,
  csf2Path: PropTypes.string,
  paths: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  usesCsf3: PropTypes.bool,
};
