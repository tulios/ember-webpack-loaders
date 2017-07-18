var fs = require('fs')
var path = require('path')
var loaderUtils = require('loader-utils')
var recursive = require('recursive-readdir-sync')

/*
 * options:
 *  - appPath: default assuming webpack.config.js in root folder + ./app
 *  - appVar: default App
 */
module.exports = function(source) {
  var options = loaderUtils.getOptions();
  var appPath = (options.appPath || 'app').replace(/\/$/, '')
  appPath = path.resolve(appPath)
  var appVar = options.appVar || 'App'

  var projectLookup = new ProjectLookup(appPath, appVar)

  projectLookup.resolve('components',  'Component')
  projectLookup.resolve('helpers',     'Helper')
  projectLookup.resolve('mixins',      'Mixin')
  projectLookup.resolve('models',      'Model')
  projectLookup.resolve('routes',      'Route')
  projectLookup.resolve('services',    'Service')
  projectLookup.resolve('controllers', 'Controller')

  source += '\n\n' + projectLookup.imports.join('\n')
  source += '\n\n' + projectLookup.lookups.join('\n')
  return source
}

function ProjectLookup(appPath, appVar) {
  this.appPath = appPath
  this.appVar = appVar
  this.imports = []
  this.lookups = []
}

ProjectLookup.prototype = {
  resolve: function(folder, moduleSufix) {
    var imports = []
    var lookups = []
    var folderPath = path.join(this.appPath, folder)
    try { fs.statSync(folderPath) } catch(e) { return }

    try {
      var files = recursive(folderPath)
      files.forEach(function(file) {
        var relativePath = file
          .replace(folderPath, '')
          .replace(/\.js/, '')

        var parts = relativePath
          .replace(/^\//, '')
          .split('/')
          .map(function(part) { return constantize(part) })

        var topLevel = parts[0]
        var constantName = parts.reduce(function(name, part) {
          if (name === '' || part === topLevel) {
            name = name || part
          } else {
            name += part
          }
          return name
        })

        constantName += moduleSufix
        var importPath = file.replace(this.appPath, '.')

        imports.push("import " + constantName + " from '" + importPath + "'")
        lookups.push(this.appVar + '.' + constantName + ' = ' + constantName);
      }.bind(this))

    } catch(err) {
      if (err.errno === 34) {
        console.log('Path does not exist');
      } else {
        throw err;
      }
    }

    this.imports = this.imports.concat(imports)
    this.lookups = this.lookups.concat(lookups)
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function constantize(str) {
  return str.split('-').map(function(s) {
    return capitalize(s)
  }).join('')
}
