const context = {}

function defineGetter(property, key) {
  context.__defineGetter__(key, function () {
    return this[property][key]
  })
}

function defineSetter(property, key) {
  context.__defineSetter__(key, function (value) {
    this[property][key] = value
  })
}


defineGetter('request','path')
defineGetter('request','url')
defineGetter('response','body')
defineSetter('response','body')

module.exports = context
