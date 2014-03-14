var Context = require('../lib/context').Context

function StyleSheet(rules) {
  this.rules = rules;
}

exports.StyleSheet = StyleSheet;

StyleSheet.prototype.toCSS = function() {
  var context = new Context()
  return this.rules.map(function(rule) { return rule.toCSS(context) })
                   .filter(function(value){ return typeof value !== 'undefined'})
                   .join("\n")
}

function Rule(selector, declarations) {
  this.selector = selector;
  this.declarations = declarations;
}

exports.Rule = Rule;

Rule.prototype.toCSS = function(parentContext) {
  var propertiesCSS = [],
      nestedRulesCSS = [],
      context = new Context(this, parentContext)

  this.declarations.forEach(function(declaration) {
    var css = declaration.toCSS(context);

    if(declaration instanceof Property) {
      propertiesCSS.push(css)
    } else if (declaration instanceof Rule) {
      nestedRulesCSS.push(css)
    }
  })

  return [ context.selector() + ' { ' + propertiesCSS.join(' ') + ' }'].
         concat(nestedRulesCSS).
         join("\n")
}

function Property(name, values) {
  this.name = name;
  this.values = values;
}

exports.Property = Property;

Property.prototype.toCSS = function(context) {
  var valuesCSS = this.values.map(function(value) { return value.toCSS(context) })
  return this.name + ": " + valuesCSS.join(" ") + ";"
}


function Literal(value) {
  this.value = value;
}

Literal.prototype.toCSS = function(context) {
  return this.value;
}

exports.Literal = Literal;


function Variable(name) {
  this.name = name;
}

Variable.prototype.toCSS = function(context) {
  return context.get(this.name)
}

exports.Variable = Variable;


function Assign(name, values) {
  this.name = name
  this.values = values
}

Assign.prototype.toCSS = function(context) {
  var valuesCSS = this.values.map(function(value) { return value.toCSS(context) })
  context.set(this.name, valuesCSS.join(' '))
}

exports.Assign = Assign;
