export default `// Example.stories.ts

// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta = {
  component: Example,
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
} satisfies Meta<typeof Example>;

export default meta;`;
