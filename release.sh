#!/bin/bash

DATE=`date '+%Y-%m-%d %H:%M:%S'`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
rm -f build.zip
yarn build
zip -r build.zip build
git checkout dev && git add . && git commit -m "Update ($DATE)" && git push && git checkout master && mkdir .tmp && mv build.zip .tmp && rm -rf * && mv .tmp/build.zip . && rm -rf .tmp && unzip build.zip && mv build/* . && rm -rf build && git add . && git commit -m "Release ($DATE)" && git push --force && git checkout dev