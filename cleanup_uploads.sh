#!/bin/bash

SYMLINKS=symlinks
UPLOADS=uploads

# create tmp files
SYMS=$(mktemp)
UPS=$(mktemp)

# Get a list of all the files pointed to by symlinks
find $SYMLINKS -type l -ls | sed "s#.* -> \(.*\)#\1#g" | sed "s#.*/uploads/\(.*\)#\1#g" > $SYMS
# Get a list of all the files we have
find $UPLOADS -type f | sed "s#uploads/\(.*\)#\1#g" > $UPS
# Filter to get the list of files to keep | and remove them
grep -F -x -v -f $SYMS $UPS | sed -e "s#^#$UPLOADS/#g" | xargs rm

# Clean up tmpfiles
rm $SYMS
rm $UPS
