npx webpack --config webpack.config.js
echo 'JavaSystem=System;plugin=this;' | cat - dist/hub.bundle.js > temp && mv temp dist/hub.bundle.js