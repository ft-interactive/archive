#!/bin/bash

if ! [ -x "$(command -v wget)" ] || ! [ -x "$(command -v rename)" ]; then
	brew install rename wget gnu-sed
fi


wget -P dist/ -mpck --user-agent="" -e robots=off -x -nH -E https://ig.ft.com/us-elections/polls

cd dist/us-elections

find . -name '*.html' -exec sh -c 'mkdir `basename "$0" .html` && mv "$0" `basename "$0" .html`/index.html' '{}' \;

find . -name index.html -exec gsed -i -e 's/src="forecast-map.svg"/src="..\/forecast-map.svg"/' {} \;
find . -name index.html -exec gsed -i -e "s/'main\.entry\.js','g-ui\/index\.js'/'\.\.\/main\.entry.js','\.\.\/g-ui\/index.js'/" {} \;
find . -name index.html -exec gsed -i -e 's/href="g-ui\/critical\.css"/href="\.\.\/g-ui\/critical\.css"/' {} \;
find . -name index.html -exec gsed -i -e 's/src="\.\.\/static\/g-ui\/o-errors\.20161025\.js"/src="\.\.\/g-ui\/o-errors\.20161025\.js"/' {} \;
find . -name index.html -exec gsed -i -e 's/href="main\.css"/href="\.\.\/main\.css"/' {} \;
find . -name index.html -exec gsed -i -e 's/href="g-ui\/main\.css"/href="\.\.\/g-ui\/main\.css"/' {} \;
find . -name index.html -exec gsed -i -e 's/src="g-ui\/top\.js"/src="\.\.\/g-ui\/top\.js"/' {} \;

find . -name "index.html" -exec gsed -i -e 's/href="\([^\.]*\)\.html"/href="..\/\1\/"/' {} \;
