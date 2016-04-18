import { join, getClientId } from '../core/Network.js'

import HeroUnit from '../entities/HeroUnit.js'
import Unit from '../entities/Unit.js'
import TowerUnit from '../entities/TowerUnit.js'
import BattleUnit from '../entities/BattleUnit.js'

import ViewportFollow from '../behaviours/ViewportFollow.js'
import SmoothMovement from '../behaviours/SmoothMovement.js'

const MAPSIZE = 1440

export default class TitleScene extends PIXI.Container {

  constructor () {

    super()

    // grass background
    this.grass = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('grass.png'), MAPSIZE, MAPSIZE)
    this.addChild( this.grass )

    this.scenery = new PIXI.Container()

    this.entities = {}

    this.addChild( this.scenery )

    // let battleUnit = new BattleUnit([
    //     { side: 0, attack: 1, defense: 1 },
    //     { side: 0, attack: 1, defense: 2 },
    //     { side: 2, attack: 2, defense: 1 },
    //     { side: 2, attack: 1, defense: 3 },
    // ])
    // battleUnit.x = 300
    // battleUnit.y = MAPSIZE
    // this.addChild( battleUnit )

    this.room = join( 'battle', { name: "Jake Badlands" } )

    this.room.on( 'update', this.onRoomUpdate.bind(this) )
    this.room.on( 'error', ( err ) => console.error( arguments ) )

    this.on( 'dispose', this.onDispose.bind(this) )

  }

  onRoomUpdate ( state, patches ) {

    if ( !patches ) {

      this.setupMap( state )

    } else {

      for ( let i=0; i < patches.length; i++ ) {

        let patch = patches [ i ]

        let [ _, entityId ] = patch.path.match(/\/entities\/([a-zA-Z0-9_-]+)/)

        if ( this.entities[ entityId ] ) {

          // Update battle units
          // Add units to battle unit
          if ( patch.path.indexOf("/units") > 0 ) {

            this.entities[ entityId ].updateUnits(
              Object.keys( state.entities[ entityId ].units ).map( id => this.entities[ id ] )
            )

            continue

          }
        }

        if ( patch.op === "add" && entityId ) {

          if ( ! this.entities[ entityId ] ) {

            // create new entity
            this.createEntity ( entityId, patch.value )

          }

        } else if ( patch.op === "replace" && this.entities[ entityId ] ) {

          // update existing entity

          let [ _, attr1, __, attr2 ] = patch.path.match(/\/entities\/[a-zA-Z0-9_-]+\/([a-zA-Z]+)(\/([a-zA-Z]+))?/)

          if ( ! this.entities[ entityId ].incoming ) {
            this.entities[ entityId ].incoming = {}
          }

          // create deep nested object
          if ( attr2 && ! this.entities[ entityId ].incoming[ attr1 ] ) {
            this.entities[ entityId ].incoming[ attr1 ] = {}
          }

          // TODO: improve me, this is the ugliest code I've ever seen
          if ( attr2 ) {
            this.entities[ entityId ].incoming[ attr1 ][ attr2 ] = patch.value

          } else {

            this.entities[ entityId ][ attr1 ] = patch.value

            // this.entities[ entityId ].incoming[ attr1 ] = patch.value
          }

        } else if ( patch.op === "remove" && this.entities[ entityId ] && patch.path.match(/\/entities\/([a-zA-Z0-9_-]+)$/) ) {

          // console.log( "Remove unit:", entityId )

          this.entities[ entityId ].kill()
          delete this.entities[ entityId ]

        }

      }

    }
  }

  setupMap ( state ) {

    //
    // add scenery elements
    //
    for ( let i = 0; i < state.map.length; i++ ) {
      let obj = state.map[ i ]
      let sprite = null

      switch ( obj.type ) {
        case "trees":
          sprite = PIXI.Sprite.fromImage('tree.png')
          break;
        case "way":
          sprite = PIXI.Sprite.fromImage('way.png')
          sprite.anchor.set( 0.5 )
          break;
      }

      if ( sprite ) {
        sprite.x = obj.x
        sprite.y = obj.y
        this.scenery.addChild( sprite )
      }

    }

    //
    // add entity elements
    //
    for ( let id in state.entities ) {
      let entity = state.entities[ id ]
      this.createEntity ( id, entity )

    }

  }

  createEntity ( entityId, data ) {

    if ( ! data ) return

    let entity = null

    switch ( data.type ) {

      case "hero":

        entity = new HeroUnit( data )

        if ( entityId === getClientId() ) {
          entity.isCurrentPlayer = true
          this.addBehaviour (new ViewportFollow, entity)
        }

        break;

      case "unit":

        entity = new Unit( data )

        break;

      case "tower":

        entity = new TowerUnit( data )

        break;

      case "battle":
        let battlingEntities = Object.keys(data.units).map( entityId => this.entities[ entityId ] )
        entity = new BattleUnit( battlingEntities )

    // let battleUnit = new BattleUnit([
    //     { side: 0, attack: 1, defense: 1 },
    //     { side: 0, attack: 1, defense: 2 },
    //     { side: 2, attack: 2, defense: 1 },
    //     { side: 2, attack: 1, defense: 3 },
    // ])
    // battleUnit.x = 300
    // battleUnit.y = MAPSIZE
    // this.addChild( battleUnit )

        break;

      case "spawn-point":
        return false

        break;
    }

    if ( !entity ) {
      console.warn( "couldn't create entity. ", data )
      return
    }

    this.addChild( entity )
    this.entities[ entityId ] = entity

    // entity entering animation
    App.tweens.add( entity ).from({ opacity: 0 }, 600, Tweener.ease.quadOut)
    App.tweens.add( entity.scale ).from({ x: 0.4, y: 0.4 }, 500, Tweener.ease.bounceOut)

    if ( data.position.x || data.position.y ) {
      entity.addBehaviour(new SmoothMovement)
      entity.x = data.position.x
      entity.y = data.position.y
    }

    return entity
  }

  onDispose () {
  }

}
