import React from 'react';
import { styled } from '@storybook/theming';

import DocsScreen from './DocsScreen';
import compiledMDX from '../../../../.storybook/compiled-mdx';
import { pageContext } from '../../layout/DocsLayout.stories';

const { tocItem } = pageContext;

const data = {
  currentPage: {
    body: compiledMDX,
    frontmatter: {
      title: 'Docs Screen Title',
    },
  },
};

const githubUrl = 'github.com';
const location = { pathname: pageContext.fullPath };

const nextTocItem = { path: '/path', title: 'Title', description: 'This is a description.' };

const Wrapper = styled.div`
  padding-bottom: 10px;
`;

export default {
  title: 'Screens/DocsScreen/DocsScreen',
  component: DocsScreen,
  decorators: [(storyFn) => <Wrapper>{storyFn()}</Wrapper>],
};

export const Base = () => <DocsScreen data={data} pageContext={pageContext} location={location} />;

export const WithSubPageTabs = () => (
  <DocsScreen
    data={data}
    pageContext={{ ...pageContext, tabs: ['guide', 'api'], activeTab: 'guide' }}
    location={location}
  />
);

export const WithGuideLink = () => (
  <DocsScreen data={data} pageContext={{ ...pageContext, nextTocItem }} location={location} />
);

export const WithGuideLinkNoDescription = () => (
  <DocsScreen
    data={data}
    location={location}
    pageContext={{
      ...pageContext,
      nextTocItem: { ...nextTocItem, description: undefined },
    }}
  />
);

export const WithGithubLink = () => (
  <DocsScreen
    data={data}
    pageContext={{ ...pageContext, tocItem: { ...tocItem, githubUrl } }}
    location={location}
  />
);

export const WithGithubLinkAndGuideLink = () => (
  <DocsScreen
    data={data}
    pageContext={{ ...pageContext, tocItem: { ...tocItem, githubUrl }, nextTocItem }}
    location={location}
  />
);
