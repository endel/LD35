// const EventEmitter = require('events').EventEmitter

const Unit = require('./Unit.js')
const uniqid = require('uniqid')

const config = require('../config.js')

const randomFactor = 2

class UnitSpawnPoint { // extends EventEmitter

  constructor ( data ) {

    // super ()

    if ( typeof(data.properties.side) === "undefined" ) data.properties.side = 2

    this.type = 'spawn-point'

    this.id = uniqid()

    this.data = data

    this.side = data.properties.side
    this.lvl = data.properties.lvl

    // One minute
    // this.spawnInterval = 1000 * 60
    this.spawnInterval = config.neutralSpawnRate

  }

  spawn ( stateHandler ) {

    if ( ! stateHandler.hasUnitAt( this.data.x, this.data.y ) ) {
      let unit = new Unit( {
        x: this.data.x,
        y: this.data.y,
        properties: {
          attack: this.lvl - Math.floor( Math.random() * randomFactor ) + Math.floor( Math.random() * randomFactor ),
          defense: this.lvl - Math.floor( Math.random() * randomFactor ) + Math.floor( Math.random() * randomFactor ),
          side: this.side
        }
      } )
      stateHandler.addEntity( unit )
    }

  }

}

module.exports = UnitSpawnPoint
