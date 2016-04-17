const uniqid = require('uniqid')

var units = new WeakMap()

class Battle {

  constructor () {

    this.id = uniqid()
    this.type = "battle"

    this.position = {x: null, y: null}
    this.units = {}

    units.set(this, [])

  }

  join ( unit ) {

    unit.isBattling = true

    this.units[ unit.id ] = true

    units.get( this ).push( unit )

  }

  leave ( unit ) {

    unit.isBattling = false

    let arr = units.get( this )
    arr.splice( arr.indexOf( unit ), 1 )

    delete this.units[ unit.id ]

  }

  // toJSON () {
  // }

}

module.exports = Battle
