const path = require('path');
const { ADDON_FRAGMENT, RECIPE_FRAGMENT } = require('./constants');

const { wait, validateResponse } = require('./helpers');

const PAGE_COMPONENT_PATH = path.resolve(
  `./src/components/screens/AddonsHomeScreen/AddonsHomeScreen.js`
);

function fetchIntegrationsHomePage(createPage, graphql) {
  return wait()
    .then(() =>
      graphql(
        `
          {
            integrations {
              popularMonthly: topIntegrations(sort: featuredMonthly, limit: 9) {
                addons {
                  ${ADDON_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                  repositoryUrl
                  npmUrl
                }
                recipes {
                  ${RECIPE_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                }
              }
              popularYearly: topIntegrations(sort: featuredYearly, limit: 9) {
                addons {
                  ${ADDON_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                  repositoryUrl
                  npmUrl
                }
                recipes {
                  ${RECIPE_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                }
              }
              trending: topIntegrations(sort: trending, limit: 12) {
                addons {
                  ${ADDON_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                  repositoryUrl
                  npmUrl
                }
                recipes {
                  ${RECIPE_FRAGMENT}
                  tags {
                    name
                    displayName
                    description
                    icon
                  }
                }
              }
            }
          }
        `
      )
    )
    .then(
      validateResponse(
        (data) =>
          data.integrations.popularMonthly &&
          data.integrations.popularYearly &&
          data.integrations.trending
      )
    )
    .then(({ data }) => data.integrations)
    .then((integrationsData) => {
      generateIntegrationHomePage(createPage, integrationsData);
    });
}

function createTagOccurrenceHash(...addons) {
  return addons
    .reduce((allTags, { tags }) => [...allTags, ...tags], [])
    .filter(({ icon }) => icon === null)
    .reduce(
      (hash, tag) => ({
        ...hash,
        [tag.name]: hash[tag.name]
          ? { ...tag, occurrence: hash[tag.name].occurrence + 1 }
          : { ...tag, occurrence: 1 },
      }),
      {}
    );
}

function getNRandomTags(tags, numberOfTags) {
  return Object.values(tags)
    .map((tag) => ({ ...tag, occurrence: tag.occurrence * Math.random() }))
    .sort((a, b) => b.occurrence - a.occurrence)
    .slice(0, numberOfTags)
    .map(({ occurrence, ...tag }) => tag);
}

function generateIntegrationHomePage(createPage, { popularMonthly, popularYearly, trending }) {
  const tagOccurrences = createTagOccurrenceHash(...trending.addons, ...popularMonthly.addons);

  createPage({
    path: '/integrations/',
    component: PAGE_COMPONENT_PATH,
    context: {
      popularAddons: {
        MONTH: popularMonthly.addons,
        YEAR: popularYearly.addons,
      },
      popularRecipes: {
        MONTH: popularMonthly.recipes,
        YEAR: popularYearly.recipes,
      },
      trendingAddons: trending.addons,
      trendingTags: getNRandomTags(tagOccurrences, 20),
    },
  });
  // eslint-disable-next-line
  console.log(` ✅ /integrations/`);
}

module.exports = function createIntegrationsHomePage(createPage, graphql) {
  // eslint-disable-next-line
  console.log(`
🧩 Creating Integrations home page
`);

  return fetchIntegrationsHomePage(createPage, graphql);
};
