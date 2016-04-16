// const EventEmitter = require('events').EventEmitter
const uniqid = require('uniqid')

class UnitSpawnPoint { // extends EventEmitter

  constructor ( data ) {

    // super ()

    if ( typeof(data.properties.side) === "undefined" ) data.properties.side = 2

    this.type = 'spawn-point'

    this.id = uniqid()

    this.data = data

    this.side = data.properties.side
    this.lvl = data.properties.lvl

  }

}

module.exports = UnitSpawnPoint
