import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Input, Icon, TableOfContents, global, styles } from '@storybook/design-system';

import GatsbyLinkWrapper from '../../basics/GatsbyLinkWrapper';
import { FilterMenu } from '../../basics';
import { AddonsLearn } from './AddonsLearn';
import { AddonsSubheading } from './AddonsSubheading';
import { AddonsSearchResults, FILTER_OPTIONS } from './AddonsSearchResults';
import { toc as addonsToc } from '../../../content/addons/categories';
import { useAddonsSearch } from '../../../hooks/use-addons-search';

const { breakpoint, spacing, color, pageMargins, typography } = styles;
const { GlobalStyle } = global;

const CategorySpacer = styled.div`
  height: 30px;
  width: 100%;

  @media (min-width: ${breakpoint * 1.333}px) {
    height: 3rem;
  }
`;

const SearchSpacer = styled.div`
  height: 30px;
  width: 100%;
`;

const Content = styled.main`
  flex: 1 1 auto;
  min-width: 0; /* do not remove  https://weblog.west-wind.com/posts/2016/feb/15/flexbox-containers-pre-tags-and-managing-overflow */
`;

const Wrapper = styled.div`
  ${pageMargins}
  padding-bottom: 3rem;

  @media (min-width: ${breakpoint * 1.333}px) {
    padding-bottom: 4rem;
    display: ${(props) => (props.searchLayout ? 'block' : 'flex')};
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${color.border};
  margin-top: 24px;
  margin-bottom: 24px;
`;

const Sidebar = styled.div`
  flex: 1;
  //margin: 1rem 0 2rem;
  display: ${(props) => (props.hideSidebar ? 'none' : 'block')};
  margin-bottom: 24px;

  @media (min-width: ${breakpoint * 1.333}px) {
    flex: 0 0 240px;
    margin-top: 0;
    margin-top: 0;
    margin-left: auto;
    margin-right: ${(props) => (props.searchLayout ? 'auto' : '20px')};
    margin-bottom: ${(props) => (props.searchLayout ? spacing.padding.medium : 0)}px;
    padding-right: ${(props) => (props.searchLayout ? 0 : 20)}px;
    border-bottom: none;
  }
`;

Sidebar.propTypes = {
  hideSidebar: PropTypes.bool.isRequired,
};

const ToCContent = styled.div`
  /* Hide ToC on mobile, the primary navigation is search */
  display: none;

  ${(props) =>
    props.hideToC
      ? `
          display: none;
        `
      : `
          @media (min-width: ${breakpoint * 1.333}px) {
            display: block;
          }
        `}
`;

ToCContent.propTypes = {
  hideToC: PropTypes.bool.isRequired,
};

const SearchInputContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
  margin-right: ${(props) => (props.searchLayout ? 15 : 0)}px;

  @media (min-width: ${breakpoint * 1.333}px) {
    max-width: 220px;
  }
`;

const ClearButton = styled.button`
  background-color: ${color.border};
  background-repeat: no-repeat;
  border: none;
  border-radius: 100%;
  overflow: hidden;
  outline: none;
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  position: absolute;
  top: 11px;
  right: 12px;
  padding: 4px;

  &:focus {
    box-shadow: ${color.secondary} 0 0 0 1px inset;
  }

  svg {
    display: block;
    margin-right: 0;
    height: 1em;
    width: 1em;
    color: ${color.dark};
  }
`;

const SearchInput = styled(Input)`
  width: 100%;

  #addons-search {
    font-size: ${typography.size.s2}px;
    line-height: 20px;
    padding-left: 36px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 30px;

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
      -webkit-appearance: none;
      appearance: none;
    }
  }

  && svg {
    left: 14px;
    font-size: ${typography.size.s2}px;
  }
`;

const Searchbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.padding.large}px;
`;

const CategoriesHeading = styled(AddonsSubheading)`
  margin-bottom: ${spacing.padding.medium}px;
`;

export const SEARCH_INPUT_ID = 'addons-search';

const sidebarItems = addonsToc.map((item) => ({ ...item, LinkWrapper: GatsbyLinkWrapper }));

export const AddonsLayout = ({
  children,
  data,
  hideSidebar,
  RenderHeader = CategorySpacer,
  currentPath,
  ...props
}) => {
  const { query, setQuery, isSearching, isSearchLoading, results } = useAddonsSearch();
  const inputRef = useRef(null);

  const [searchFilter, setSearchFilter] = useState([FILTER_OPTIONS.ALL]);

  const { integrations, relatedTags } = results;

  const foundAddonsCount = useMemo(() => integrations.addons.length, [integrations]);
  const foundRecipesCount = useMemo(() => integrations.recipes.length, [integrations]);

  return (
    <>
      <GlobalStyle />
      {isSearching ? <SearchSpacer /> : <RenderHeader />}
      <Wrapper searchLayout={isSearching}>
        <Sidebar hideSidebar={hideSidebar} searchLayout={isSearching}>
          <Searchbar>
            <SearchInputContainer searchLayout={isSearching}>
              <SearchInput
                id={SEARCH_INPUT_ID}
                ref={inputRef}
                type="search"
                label="Search"
                hideLabel
                icon="search"
                appearance="pill"
                placeholder="Search integrations"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              {query !== '' && (
                <ClearButton
                  onClick={() => {
                    setQuery('');
                    inputRef.current.focus();
                  }}
                >
                  <Icon icon="closeAlt" aria-label="clear" />
                </ClearButton>
              )}
            </SearchInputContainer>

            {isSearching && !isSearchLoading && (foundAddonsCount > 0 || foundRecipesCount > 0) && (
              <FilterMenu
                items={[
                  {
                    title: `All integrations`,
                    value: 'all',
                  },
                  { title: `Addons (${foundAddonsCount})`, value: 'addons' },
                  { title: `Recipes (${foundRecipesCount})`, value: 'recipes' },
                ]}
                value={searchFilter}
                onChange={setSearchFilter}
              />
            )}
          </Searchbar>
          <TableOfContents currentPath={currentPath} items={sidebarItems}>
            {({ menu }) => (
              <ToCContent hideToC={isSearching}>
                <CategoriesHeading>Categories</CategoriesHeading>
                {menu}
                <Divider />
                <AddonsLearn />
              </ToCContent>
            )}
          </TableOfContents>
        </Sidebar>

        {isSearching ? (
          <AddonsSearchResults
            isLoading={isSearchLoading}
            searchString={query}
            integrations={integrations}
            relatedTags={relatedTags}
            filterResults={searchFilter[0]}
            {...props}
          />
        ) : (
          <Content {...props}>{children}</Content>
        )}
      </Wrapper>
    </>
  );
};

AddonsLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPath: PropTypes.string,
  hideSidebar: PropTypes.bool,
};

AddonsLayout.defaultProps = {
  hideSidebar: false,
  currentPath: '',
};
