#!/bin/bash

DATE=`date '+%Y-%m-%d %H:%M:%S'`
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
rm -f build.zip
yarn build
zip -r build.zip build
git checkout dev && git add . && git commit -m "Update ($DATE)" && git push && git checkout master