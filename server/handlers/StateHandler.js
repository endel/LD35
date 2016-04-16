const EventEmitter = require('events').EventEmitter

const Hero = require('../entities/Hero.js')
const Unit = require('../entities/Unit.js')
const Tower = require('../entities/Tower.js')
const UnitSpawnPoint = require('../entities/UnitSpawnPoint.js')

var playerId = 0

class StateHandler {

  constructor ( clock, map ) {

    this.clock = clock
    this.map = []

    this.obstacles = []

    this.entities = {}
    this.spawnPositions = {}

    //
    // Parse tiled object layers
    //
    for (var i = 0; i < map.layers.length; i++) {

      let layer = map.layers[ i ]

      for (var j = 0; j < layer.objects.length; j++) {

        this.parseObject( layer.name, layer.objects[ j ] )

      }

    }

  }

  createHero ( data ) {

    let hero = new Hero({
      id: data.id,
      name: `Player ${ playerId }`, // data.name
      x: this.spawnPositions[ data.side ].x,
      y: this.spawnPositions[ data.side ].y,
      properties: {
        attack: 1,
        defense: 1,
        side: data.side
      }
    })

    this.addEntity( hero )

    return hero

  }

  addEntity ( instance ) {

    this.entities[ instance.id ] = instance

  }


  parseObject ( type, object ) {

    let obj = {
      x: object.x,
      y: object.y,

      width: object.width,
      height: object.height,

      type: type,
      properties: object.properties,
    }

    switch ( type ) {
      case "spawn-points":

        this.spawnPositions[ obj.properties.side ] = {
          x: obj.x,
          y: obj.y
        }

        break;

      case "neutral-units":

        let unitSpawnPoint = new UnitSpawnPoint( obj )
        this.addEntity( unitSpawnPoint )

        break;

      case "trees":

        this.map.push( obj )
        this.obstacles.push( obj )

        break;

      case "way":

        this.map.push( obj )

        break;

      case "towers":

        let towerEntity = new Tower( obj )

        this.addEntity( towerEntity )

        break;

    }


    console.log( type, object )

  }

  update ( currentTime ) {

    this.clock.tick()

    // update all entities
    for ( let id in this.entities ) {

      if ( this.entities[ id ].update ) {

        this.entities[ id ].update()

      }

    }

  }

  toJSON () {

    return {
      map: this.map,
      obstacles: this.obstacles,
      entities: this.entities,
    }

  }

}

module.exports = StateHandler
