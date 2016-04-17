const EventEmitter = require('events').EventEmitter

const Hero = require('../entities/Hero.js')
const Unit = require('../entities/Unit.js')
const Battle = require('../entities/Battle.js')
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
    this.towers = []

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

    if ( instance.setup ) {
      instance.setup( this )
    }

    this.entities[ instance.id ] = instance

  }

  hasUnitAt ( x, y ) {
    for ( let id in this.entities ) {
      if ( this.entities [ id ] instanceof Unit &&
           this.entities [ id ].data.x === x && this.entities [ id ].data.y === y ) {
        return true
      }
    }
    return false
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
        this.clock.setInterval( unitSpawnPoint.spawn.bind(unitSpawnPoint, this), unitSpawnPoint.spawnInterval  )
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

        this.towers.push( towerEntity )

        this.addEntity( towerEntity )

        break;

    }

  }

  update ( currentTime ) {

    this.clock.tick()

    // update all entities
    for ( let id in this.entities ) {

      let entity = this.entities[ id ]

      if ( entity.update ) {

        entity.update( this )

      }

      //
      // move entity if destiny pending
      //
      if ( entity.destiny && ! entity.isBattling ) {

        let angle = Math.atan2( entity.destiny.y - entity.position.y, entity.destiny.x - entity.position.x )
        let nextEntityPosition = {
          x: entity.position.x + ( Math.cos( angle ) * entity.speed ) * this.clock.deltaTime,
          y: entity.position.y + ( Math.sin( angle ) * entity.speed ) * this.clock.deltaTime
        }

        this.checkCollision( entity, angle, nextEntityPosition )
        // let collidingWith =

        this.entities[ id ].position.x = nextEntityPosition.x
        this.entities[ id ].position.y = nextEntityPosition.y

        let distance = Math.sqrt(
          Math.pow( entity.position.x - entity.destiny.x, 2 ) +
          Math.pow( entity.position.y - entity.destiny.y, 2 )
        )

        // reached destiny, remove it
        if ( distance < 5 ) { entity.destiny = null }

      }

    }

  }

  checkCollision ( entity, angle, position ) {

    // TODO : use quadtree / steering behaviour
    for ( let i = 0 ; i < this.obstacles.length; i++ ) {
      // if ( position.x )
      // console.log( this.obstacles[ i ] )
    }

    for ( let id in this.entities ) {
      let otherEntity = this.entities[ id ]

      //
      // prevent collision with entities from the same side
      //
      if (
        otherEntity.side === entity.side ||
        ( !( otherEntity instanceof Unit ) && !( otherEntity instanceof Battle))
      ) {
        continue;
      }

      let distance = Math.sqrt(
        Math.pow( entity.position.x - otherEntity.position.x, 2 ) +
        Math.pow( entity.position.y - otherEntity.position.y, 2 )
      )


      if ( distance < 15 && otherEntity instanceof Unit && !otherEntity.isBattling ) {

        // create battle instance!
        let battle = new Battle()
        battle.position = {
          x: ( entity.position.x + otherEntity.position.x ) / 2,
          y: ( entity.position.y + otherEntity.position.y ) / 2
        }
        battle.join( entity )
        battle.join( otherEntity )

        this.addEntity( battle )

      } else if ( distance < 30 && otherEntity instanceof Battle ) {

        // join the battle!
        otherEntity.join( entity )

      }

    }

  }

  toJSON () {

    return {
      map: this.map,
      entities: this.entities
    }

  }

}

module.exports = StateHandler
