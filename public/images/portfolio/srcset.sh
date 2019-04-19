#!/bin/bash

FILENAME=$1
REV=`rev<<<$FILENAME`
FILEBASE=`echo $REV | cut -d"." -f2- | rev`
FILEEXT=`echo $REV | cut -d"." -f1 | rev`

mv "$FILEBASE.$FILEEXT" "$FILEBASE.x3.$FILEEXT"
convert "$FILEBASE.x3.$FILEEXT" -resize 2240x "$FILEBASE.x2.$FILEEXT"
convert "$FILEBASE.x3.$FILEEXT" -resize 1120x "$FILEBASE.$FILEEXT"
