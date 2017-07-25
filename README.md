# Ember Webpack Loaders

A set of webpack loaders to help with ember integration.

Check the example app here: https://github.com/tulios/ember-webpack-example

## Install

```sh
npm install ember-webpack-loaders
```

## Usage

Apply this set of loaders to your `webpack.config.js`:

```js
{
  module: {
    loaders: [
      {
        test: /\.hbs$/,
        include: /app\/templates/, // or whatever directory you have
        loader: 'ember-webpack-loaders/htmlbars-loader'
      },
      {
        test: /app\/index\.js/, // the main app file
        use: [
            {
              loader: 'ember-webpack-loaders/inject-templates-loader',
              options: {
                appPath: './path/to/app',
              }
            },
            {
              loader: 'ember-webpack-loaders/inject-modules-loader',
              options: {
                appPath: './path/to/app',
              }
            }
         ],
       }
    ]
  }
}
```

## Options

#### for ember-webpack-loaders/htmlbars-loader

* __appPath__: Path for your ember app. Default assuming `webpack.config.js` in root folder and `./app`
* __templateCompiler__: default 'components-ember/ember-template-compiler.js'

#### for ember-webpack-loaders/inject-templates-loader

* __appPath__: Path for your ember app. Default assuming `webpack.config.js` in root folder and `./app`

#### for ember-webpack-loaders/inject-modules-loader

* __appPath__: Path for your ember app. Default assuming `webpack.config.js` in root folder and `./app`
* __appVar__: Variable name of your `Ember.Application`. Default `App`

Example:

```js
{
  module: {
    loaders: [
      {
        test: /app\/index\.js/,
        loader: 'ember-webpack-loaders/inject-templates-loader!ember-webpack-loaders/inject-modules-loader',
        options: {
          appVar: 'MyProject'
        }
      }
    ]
  }
}
```

## License

See [LICENSE](https://github.com/tulios/ember-webpack-loaders/blob/master/LICENSE) for more details.
