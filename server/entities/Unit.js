const uniqid = require('uniqid')

class Unit {

  constructor ( data ) {

    if ( typeof(data.properties.side) === "undefined" ) data.properties.side = 2

    this.position = { x: data.x, y: data.y }
    this.destiny = null

    this.isBattling = false

    this.type = 'unit'

    this.id = data.id || uniqid()
    this.data = data

    this.speed = 0.05
    this.attack = data.properties.attack || 0
    this.defense = data.properties.defense || 1

    this.side = parseInt( data.properties.side )

  }

  moveTo ( point ) {

    this.destiny = point

  }


}

module.exports = Unit
