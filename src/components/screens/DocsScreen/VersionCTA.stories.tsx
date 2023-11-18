import React from 'react';
import { styled } from '@storybook/theming';
import { VersionCTA } from './VersionCTA';
import { pageContext } from '../../layout/DocsLayout/DocsLayout.stories';

const { versions } = pageContext;

const Wrapper = styled.div`
  padding: 20px;
`;

export default {
  title: 'Screens/DocsScreen/VersionCTA',
  component: VersionCTA,
  decorators: [(storyFn) => <Wrapper>{storyFn()}</Wrapper>],
};

const Template = (args) => <VersionCTA {...args} />;

export const OldVersion = Template.bind({});
OldVersion.args = {
  version: versions.stable[1].version,
  latestVersion: versions.stable[0].version,
  latestVersionString: versions.stable[0].string,
  versions,
  slug: '/docs/get-started/install',
};

export const PreReleaseVersion = Template.bind({});
PreReleaseVersion.args = {
  ...OldVersion.args,
  version: versions.preRelease[0].version,
};

export const PreReleaseRCVersion = Template.bind({});
PreReleaseRCVersion.args = {
  ...PreReleaseVersion.args,
  versions: {
    ...versions,
    preRelease: [{ ...versions.preRelease[0], label: 'rc' }],
  },
};
