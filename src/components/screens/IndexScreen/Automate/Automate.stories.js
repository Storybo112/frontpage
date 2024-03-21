import React from 'react';
import { Automate } from './Automate';

export default {
  title: 'Screens/IndexScreen/Automate/Automate',
  component: Automate,
  parameters: {
    chromatic: { viewports: [320, 1200] },
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => <Automate docs="/" />,

  parameters: {
    backgrounds: { default: 'dark' },
  },
};
