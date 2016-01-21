var path = require('path')
var loaderUtils = require('loader-utils')
var recursive = require('recursive-readdir-sync')

/*
 * options:
 *  - appPath: default assuming webpack.config.js in root folder + ./app
 */
module.exports = function(source) {
  var options = loaderUtils.parseQuery(this.query);
  var appPath = (options.appPath || 'app').replace(/\/$/, '')
  appPath = path.resolve(appPath)
  var templatesFolder = path.join(appPath, 'templates')

  try {
    var templates = []
    var files = recursive(templatesFolder)
    files.forEach(function(file) {
      var templateRelativePath = file.replace(appPath, '.')
      templates.push("import '" + templateRelativePath + "'")
    })

    source += '\n\n' + templates.join('\n')

  } catch(err) {
    if (err.errno === 34) {
      console.log('Path ' + TEMPLATES_FOLDER + ' does not exist');
    } else {
      throw err;
    }
  }

  return source
}
