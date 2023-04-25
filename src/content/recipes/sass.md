<div class="aside aside__no-top">

Some configurations of Storybook already come pre-configured to support Sass. If your project meets the following, you're likely ready to go.

1. Storybook >= 7.x with the `vite` builder.
2. Storybook >= 7.x with the `@storybook/nextjs` framework.
3. Storybook >= 6.x with the `@storybook/preset-create-react-app` and `react-scripts@2.x.x` or higher.

</div>

<RecipeHeader>

How to setup Sass and Storybook

</RecipeHeader>

Sass is a popular CSS preprocessor that allows developers to write more maintainable and reusable stylesheets. Storybook is an industry-standard tool for developing and testing UI components in isolation. With the help of the `@storybook/addon-styling` package, developers can easily incorporate Sass stylesheets into their Storybook components.

## Adding `@storybook/addon-styling`

First of all, install the required dependencies:

```shell
yarn add -D @storybook/addon-styling sass
```

Then add register `@storybook/addon-styling` in your `main.js` like so:

```js
module.exports = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          // Require your Sass preprocessor here
          implementation: require('sass'),
        },
      },
    },
  ],
};
```

## Import global styles

If you have any global styles you would like to expose for your stories, you can now import them into your `preview.js` file:

```js
// .storybook/preview.js
import '../src/index.scss';
```

## Get involved

Now you're ready to use Sass with Storybook. 🎉 If you use Sass at work, we'd love your feedback on the Sass + Storybook experience.

Join the maintainers and our thriving community in [Discord](https://discord.gg/storybook).
