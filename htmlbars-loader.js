var loaderUtils = require('loader-utils')
var HtmlbarsCompiler = require('ember-cli-htmlbars')

var DEFAULT_TEMPLATE_COMPILER = 'components-ember/ember-template-compiler.js'
var templateTree
var appPath

module.exports = function(source) {
  this.cacheable && this.cacheable()
  var options = loaderUtils.parseQuery(this.query);
  var appPath = (options.appPath || 'app').replace(/\/$/, '')
  var templatesFolder = appPath + '/templates'

  templateTree = templateTree || new HtmlbarsCompiler(templatesFolder, {
    isHTMLBars: true,
    templateCompiler: require(options.templateCompiler || DEFAULT_TEMPLATE_COMPILER)
  });

  var resourcePathMatcher = new RegExp(templatesFolder + '/(.*)\.hbs$')
  var templateMatch = this.resourcePath.match(resourcePathMatcher)
  var templatePath = templateMatch.pop()

  var fullTemplate = templateTree.processString(source, templatePath)
  var templateString = fullTemplate.replace(/^export default Ember\./, 'Ember.')
  return 'Ember.TEMPLATES["' + templatePath + '"] = ' + templateString
}
