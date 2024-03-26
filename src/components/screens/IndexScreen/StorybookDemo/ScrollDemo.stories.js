import { useMotionValue } from 'framer-motion';
import React from 'react';
import { ScrollDemo as ScrollDemoComponent } from './ScrollDemo';

export default {
  title: 'Storybook Demos/ScrollDemo',
  component: ScrollDemoComponent,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: true },
  },
};

export const ScrollDemo = {
  render: () => {
    const value = useMotionValue(0);
    return (
      <ScrollDemoComponent
        style={{ width: 800 }}
        isolationProgress={value}
        addonsProgress={value}
        dropInProgress={value}
        storyIndex={value}
        panelIndex={value}
      />
    );
  },

  name: 'ScrollDemo',

  parameters: {
    backgrounds: { default: 'dark' },
  },
};
