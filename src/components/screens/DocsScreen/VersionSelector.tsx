import React from 'react';
import { Menu } from '@storybook/components-marketing';

import buildPathWithVersion from '../../../util/build-path-with-version';

const stylizeVersion = ({ label, string }: { label?: string; string: string }) =>
  label ? `${string} (${label})` : string;

interface Stable {
  version: number;
  string: string;
  label?: 'latest';
}

interface PreRelease {
  version: number;
  string: string;
  label: 'alpha' | 'beta' | 'rc' | 'future';
}

export interface Versions {
  stable: Stable[];
  preRelease: PreRelease[];
}

interface VersionSelectorProps {
  version: number;
  slug: string;
  versions: Versions;
}

export function VersionSelector({ version, versions, slug }: VersionSelectorProps) {
  const getVersionLink = ({ label, string }: { label?: string; string: string }) => ({
    label: stylizeVersion({ label, string }),
    link: { url: buildPathWithVersion(slug, string) },
  });

  const stableLinks = versions.stable.map(getVersionLink);
  const preReleaseLinks = versions.preRelease.map(getVersionLink);

  const versionOptions = [
    {
      label: 'stable',
      items: stableLinks,
    },
  ];
  if (preReleaseLinks.length > 0) {
    versionOptions.push({
      label: 'pre-release',
      items: preReleaseLinks,
    });
  }

  const activeVersion = stylizeVersion(
    [...versions.stable, ...versions.preRelease].find(({ version: v }) => v === version)
  );

  return <Menu label={activeVersion} items={versionOptions} primary />;
}
