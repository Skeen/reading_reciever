#!/bin/bash

SYMLINKS=symlinks
UPLOADS=uploads

# Get the amount of memory used by uploads
UPLOADS=$(du -b uploads/ | cut -f1)

# Get the amount of memory used by stuff pointed by symlinks in bytes
SYMLINKS=$(find $SYMLINKS -type l -ls | sed "s#.* -> \(.*\)#\1#g" | sed "s#.*/uploads/\(.*\)#uploads/\1#g" | xargs du -b | cut -f1 | paste -sd+ | bc)

echo -e "Uploads store:\t\t $(echo $UPLOADS | numfmt --to=si | awk '{print $1"b"}')"
echo -e "Symlinks point to:\t $(echo $SYMLINKS | numfmt --to=si | awk '{print $1"b"}')"
echo -e "Difference is:\t\t $(expr $UPLOADS - $SYMLINKS | numfmt --to=si | awk '{print $1"b"}')"

