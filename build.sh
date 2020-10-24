export MODULE_NAME=$1
# npx webpack --config webpack.config.js
node_modules/webpack/bin/webpack.js
echo 'JavaSystem=System;plugin=this;' | cat - dist/$1.bundle.js > temp && mv temp dist/$1.bundle.js