#!/bin/bash

# Check if the script is called with a file argument
curl -O https://firebasestorage.googleapis.com/v0/b/elewa-conv-learning-prod.appspot.com/o/emulator-data.zip\?alt\=media\&token\=bab68cc2-a84d-4d14-99d4-d7e8ecd71efe

filename="emulator-data.zip"

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
