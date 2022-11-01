import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import pluralize from 'pluralize';
import { styles, TagList, TagLink } from '@storybook/design-system';
import { AddonsList } from './AddonsList';
import { AddonsAside, AddonsAsideContainer } from './AddonsAsideLayout';
import { AddonsSubheading } from './AddonsSubheading';
import { ListHeadingContainer, ListSubheading } from '../../basics';
import { RecipesList } from '../recipes/RecipesList';
import { recipeItemsData } from '../recipes/RecipesList.stories';

// TODO: Remove mock recipe items
const MOCK_RECIPES = recipeItemsData.slice(0, 2);

const { breakpoint, spacing, color, typography } = styles;

const SearchResultsContainer = styled(AddonsAsideContainer)`
  align-items: flex-start;
`;

const SearchSummaryCopy = styled.div`
  font-size: ${typography.weight.bold};
  line-height: 28px;
  color: ${color.darkest};
  margin-left: ${spacing.padding.medium}px;

  @media (min-width: ${breakpoint * 1.333}px) {
    margin-left: 0;
  }
`;

const ResultsContainer = styled.div`
  flex: 1 1 auto;
  width: 100%;
`;

const StyledAddonsList = styled(AddonsList)`
  margin-bottom: 48px;
`;

const StyledRecipesList = styled(RecipesList)`
  margin-bottom: 48px;
`;

const RelatedTagsList = styled(TagList)`
  margin-bottom: 48px;
`;

export const AddonsSearchSummary = ({ isLoading, count }) => {
  return isLoading ? null : (
    <SearchSummaryCopy>
      {count === 0 ? 'No integrations' : pluralize('integrations', count, true)}
    </SearchSummaryCopy>
  );
};

const NoAddonsFoundInner = styled.div`
  flex: 1 1 auto;
  border: 1px dashed ${color.border};
  border-radius: 5px;
  padding: 32px;
  text-align: center;
  width: 100%;

  font-size: ${typography.size.s2}px;
  line-height: ${typography.size.m1}px;
  color: ${color.dark};
  text-align: center;

  h3 {
    font-size: ${typography.size.s2}px;
    line-height: ${typography.size.m1}px;
    font-weight: ${typography.weight.bold};
  }
`;

const NoAddonsFound = () => (
  <NoAddonsFoundInner>
    <h3>No addons found</h3>
    <div>Perhaps it was a typo?</div>
  </NoAddonsFoundInner>
);

AddonsSearchSummary.propTypes = {
  count: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
};

AddonsSearchSummary.defaultProps = {
  isLoading: false,
};

export const AddonsSearchResults = ({ isLoading, integrations, relatedTags, ...props }) => {
  const { addons = [], recipes = [] } = integrations;
  const integrationCount = addons.length + recipes.length;

  return (
    <SearchResultsContainer {...props}>
      {!isLoading && integrationCount === 0 ? (
        <NoAddonsFound />
      ) : (
        <ResultsContainer>
          <section>
            <ListHeadingContainer>
              <ListSubheading>Addons</ListSubheading>
            </ListHeadingContainer>
            <StyledAddonsList isLoading={isLoading} addonItems={integrations.addons} />
          </section>
          <section>
            <ListHeadingContainer>
              <ListSubheading>Recipes</ListSubheading>
            </ListHeadingContainer>
            <StyledRecipesList isLoading={isLoading} recipeItems={integrations.recipes} />
          </section>
        </ResultsContainer>
      )}
      <AddonsAside>
        {!isLoading && integrationCount > 0 && (
          <>
            <AddonsSubheading>Related tags</AddonsSubheading>
            <RelatedTagsList
              limit={6}
              tags={relatedTags.map((tag) => (
                <TagLink key={tag.link} href={tag.link}>
                  {tag.name}
                </TagLink>
              ))}
              isLoading={relatedTags?.length === 0}
            />
          </>
        )}
      </AddonsAside>
    </SearchResultsContainer>
  );
};

AddonsSearchResults.propTypes = {
  isLoading: PropTypes.bool,
  results: AddonsList.propTypes.addonItems,
  relatedTags: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

AddonsSearchResults.defaultProps = {
  isLoading: false,
  results: [],
  relatedTags: [],
};
