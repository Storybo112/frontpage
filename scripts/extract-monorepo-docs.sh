#!/bin/bash -

# Pull the monorepo docs from the branch specified as the first argument, or `main`.

MONOREPO_CODELOAD_URL='https://codeload.github.com/storybookjs/storybook/tar.gz'
BRANCH=${1:-main}
TAR_NAME="storybook-$BRANCH"
REPO_SUBDIR='docs/'
REPO_DEPTH=2 # number of dirs + 1
REPO_DIRNAME_INPUT=$2
REPO_DIRNAME="src/content/docs$REPO_DIRNAME_INPUT"

set -e

mkdir -p $REPO_DIRNAME
rm -rf $REPO_DIRNAME/*
curl $MONOREPO_CODELOAD_URL/$BRANCH | tar -zxvC $REPO_DIRNAME --strip $REPO_DEPTH $TAR_NAME/$REPO_SUBDIR
