#!/bin/bash

filename="emulator-data.zip"
fileurl="https://firebasestorage.googleapis.com/v0/b/elewa-clm-test.appspot.com/o/emulator-data%2Femulator-data.zip?alt=media&token=ebb5e830-f478-4378-ab59-8ba58daf2bf9"

# Download the zipped emulator data file
curl -o emulator-data.zip "$fileurl"

# Create a directory to extract the contents
target_dir="."
mkdir -p "$target_dir"

# Extract the contents of the zip file
if command -v bsdtar >/dev/null; then
  bsdtar -xf "$filename" -C "$target_dir"
elif command -v unzip >/dev/null; then
  unzip "$filename" -d "$target_dir"
else
  if command -v powershell.exe >/dev/null; then
    powershell.exe -Command "Expand-Archive -Path \"$filename\" -DestinationPath \"$target_dir\""
  else
    echo "Error: Neither 'bsdtar', 'unzip', nor 'powershell' commands found."
    exit 1
  fi
fi

rm "$filename"

echo "Extraction complete. Contents extracted to: $target_dir"
