Package.describe({
  name: 'rahul:singularity',
  version: '0.0.1',
  summary: 'Build your app using isomorphic components with Blaze',
  git: '',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "compileBlz",
  use: ["spacebars-compiler", "reactive-var"],
  sources: ["plugin/singularity.js"]
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.imply("reactive-var");
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('rahul:singularity');
  api.addFiles('blaze-template-tests.js');
});
