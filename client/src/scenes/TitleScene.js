import { join, getClientId } from '../core/Network.js'

import HeroUnit from '../entities/HeroUnit.js'
import Unit from '../entities/Unit.js'
import TowerUnit from '../entities/TowerUnit.js'
import BattleUnit from '../entities/BattleUnit.js'

import ViewportFollow from '../behaviours/ViewportFollow.js'

const MAPSIZE = 1440

export default class TitleScene extends PIXI.Container {

  constructor () {

    super()

    // grass background
    this.grass = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('grass.png'), MAPSIZE, MAPSIZE)
    this.addChild( this.grass )

    this.scenery = new PIXI.Container()

    this.addChild( this.scenery )

    // let battleUnit = new BattleUnit([
    //     { team: 0, attack: 1, defense: 1 },
    //     { team: 0, attack: 1, defense: 2 },
    //     { team: 1, attack: 2, defense: 1 },
    //     { team: 1, attack: 1, defense: 3 },
    // ])
    // battleUnit.x = 300
    // battleUnit.y = 100
    // this.addChild( battleUnit )

    this.room = join( 'battle', { name: "Jake Badlands" } )

    this.room.on( 'update', this.onRoomUpdate.bind(this) )
    this.room.on( 'error', ( err ) => console.error( arguments ) )

    this.on('dispose', this.onDispose.bind(this))

  }

  onRoomUpdate ( state, patches ) {
    if ( !patches ) {

      this.setupMap( state )

    } else {

      console.log("Patches:", patches)

      for ( let i=0; i < patches.length; i++ ) {

        let patch = patches [ i ]

        let [ _, entityId ] = patch.path.match(/\/entities\/([a-zA-Z0-9_-]+)/)

        if ( patch.op === "add" && entityId ) {

          this.createEntity ( entityId, patch.value )

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
          this.addBehaviour (new ViewportFollow, entity)
        }

        break;

      case "unit":

        entity = new Unit( data )

        break;

      case "tower":

        entity = new TowerUnit( data )

        break;

      case "spawn-point":
        return false

        break;
    }

    this.addChild( entity )

    if ( data.data.x || data.data.y ) {
      entity.x = data.data.x
      entity.y = data.data.y
    }

    return entity
  }

  onDispose () {
  }

}
