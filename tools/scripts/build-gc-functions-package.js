const packageJson = require('../../package.json'); // Take root package.json
const fs = require('fs');
const deps = packageJson['firebase-functions-dependencies'];

// Template of package.json for Firebase Functions
const firebaseFunctionsPackageJson = {
  engines: { node: '14' },
  main: 'main.js',

  // filter only dependencies we need for Firebase Functions
  dependencies: deps.reduce((acc, cur) => {
    acc[cur] = packageJson.dependencies[cur];
    return acc;
  }, {})
};

// Only for demo purpose:
console.log(
  'Firebase Functions package.json:\n',
  JSON.stringify(firebaseFunctionsPackageJson, null, 2)
);

const path = 'dist/apps/conv-lm-backend/package.json'; // Where to save generated package.json file

fs.writeFileSync(path, JSON.stringify(firebaseFunctionsPackageJson));
console.log(`${path} written successfully.`);
