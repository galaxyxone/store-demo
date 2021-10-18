'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';
const sassTypes = require('sass').types;
const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      './app/index.html',
      './app/components/**/*.hbs',
      './app/templates/**/*.hbs'
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
};

// Default light theme
let storeTheme = {
  'primary': '#2926cf',
  'secondary': '#9c9cff',
  'logo-color': '#2926cf',
  'headings-color': '#131e38',
  'btn-color': '#ffffff',
  'link-color-active': '#2926cf',
  'footer-color': '#6c757d',
  'background': '#f9fafb',
};

// Add optional themes, currently only supports dark
if (process.env.THEME_NAME === 'dark') {
  storeTheme = {
    'primary': '#2926cf',
    'secondary': '#91fcfd',
    'logo-color': '#ffffff',
    'headings-color': '#f8faff',
    'btn-color': '#138080',
    'link-color-active': '#68ffff',
    'footer-color': '#f3f5f6',
    'background': '#444a57',
  };
}

// Build sass theme map from theme
const sassTheme = new sassTypes.Map(Object.keys(storeTheme).length);
let i = 0;
for (const key in storeTheme) {
  // Keys are always strings
  sassTheme.setKey(i, new sassTypes.String(key));
  // Values can be colors or strings
  let value = storeTheme[key];
  let sassValue;
  if (value[0] === '#') {
    sassValue = new sassTypes.Color(parseInt(`ff${value.replace('#', '')}`, 16));
  } else {
    sassValue = new sassTypes.String(value);
  }
  sassTheme.setValue(i, sassValue);
  i++;
}

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg'],
      exclude: ['tokenAsset-1.png', 'tokenAsset-2.png', 'tokenAsset-3.png']
    },
    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              functions: {
                'theme': function () {
                  return sassTheme;
                },
              },
              includePaths: [
                'node_modules/bootstrap/scss',
              ],
            },
          },
          ...(isProduction ? [purgeCSS] : []),
        ]
      },
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
