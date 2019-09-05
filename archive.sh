rm -rf dist
# --recursive -r turn on recursive retrieving
# --level -l maximum level depth
# --no-parent -np do not ever ascend to the parent directory when retrieving recursively
# --no-directories -nd do not create a hierarchy of directories when retrieving recursively
# --page-requisites -p download all the files that are necessary to display a given page, such as inlined images, sounds, and referenced stylesheets
# --convert-links -k  convert the links in the document to make them suitable for local viewing
# --adjust-extension -E appends .html to files without an extension
# --directory-prefix -P where files will be saved to
# --execute -e used to ignore robots.txt
wget \
    --recursive \
    --level 1 \
    --no-parent \
    --no-directories \
    --page-requisites \
    --convert-links \
    --adjust-extension \
    --directory-prefix dist \
    --execute robots=off \
    --no-verbose \
        http://elections.ft.com/uk/2015/parties \
        http://elections.ft.com/uk/2015/seatmoves \
        http://elections.ft.com/uk/2015/coalition-calculator \
        http://elections.ft.com/uk/2015/results \
        http://elections.ft.com/uk/2015/projections \
        http://elections.ft.com/uk/2015/coalition-forecast
wget \
    --directory-prefix dist/js \
    --no-verbose \
    http://elections.ft.com/js/vendor-ab6c2f97.js \
    http://elections.ft.com/js/common-6164024a.js \
    http://elections.ft.com/js/sankey-63d8210b.js \
    http://elections.ft.com/js/coalition-calculator-86cf3751.js \
    http://elections.ft.com/js/results-f611c614.js \
    http://elections.ft.com/js/group-forecast-slopes-8aadaf0b.js \
    http://elections.ft.com/js/coalition-forecast-b652e0f7.js \
    https://ig.ft.com/data/geo/uk/simplemap.json
mkdir dist/css
for filename in dist/*.html
do
    mkdir dist/$(basename $filename .html)
    mv $filename dist/$(basename $filename .html)/index.html
    mv dist/*.css dist/css
done
sed -Ei '' 's/"stylesheet" href="(main|results|coalition-calculator|probable-coalitions|projections|seatmoves)/"stylesheet" href="..\/css\/\1/g' dist/*/*.html
sed -Ei '' 's/http:\/\/elections.ft.com/../g' dist/css/*.css
sed -Ei '' 's/icons@\^/icons@/g' dist/css/*.css
sed -Ei '' 's/https:\/\/h2\.ft\.com\/image/http:\/\/image\.webservices\.ft\.com/g' dist/css/*.css
sed -Ei '' 's/fticon:search\?width=13&source=ge15\) no-repeat 10px/fticon:search\?width=13\&source=ge15\) no-repeat 10px;background-size:13px/g' dist/css/*.css
sed -Ei '' 's/"\/js\//"\.\.\/js\//g' dist/*/*.html
sed -Ei '' 's/http:\/\/elections.ft.com\/uk\/2015\///g' dist/*/*.html
sed -Ei '' 's/elections.ft.com/ft.com/g' dist/*/*.html
sed -Ei '' 's/projections.html#/#/g' dist/projections/index.html
sed -Ei '' 's/http:\/\/interactivegraphics\.ft-static\.com\/data\/geo\/uk/\.\.\/js/g' dist/js/group-forecast-slopes-8aadaf0b.js

tree dist
