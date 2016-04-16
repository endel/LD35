const uniqid = require('uniqid')

class Unit {

  constructor ( data ) {

    if ( typeof(data.properties.side) === "undefined" ) data.properties.side = 2

    this.type = 'unit'

    this.id = data.id || uniqid()
    this.data = data

    this.attack = data.properties.attack || 0
    this.defense = data.properties.defense || 1

    this.side = data.properties.side

  }

}

module.exports = Unit
