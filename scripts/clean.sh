rm -r node_modules;
rm package-lock.json;
rm yarn.lock;

lerna clean --yes;
find . -name "package-lock.json" -delete
find . -name "yarn.lock" -delete

#npm install
yarn
lerna bootstrap