#!/bin/bash

if ! [ -x "$(command -v wget)" ] || ! [ -x "$(command -v rename)" ]; then
	brew install rename wget
fi


wget -P dist/ -mpck --user-agent="" -e robots=off -x -nH -E https://ig.ft.com/us-elections/polls

cd dist/us-elections

find . -name '*.html' -exec sh -c 'mkdir `basename "$0" .html` && mv "$0" `basename "$0" .html`/index.html' '{}' \;

find . -name index.html -exec gsed -i -e 's/src="forecast-map.svg"/src="..\/forecast-map.svg"/' {} \;