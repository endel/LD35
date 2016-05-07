import { join, getClientId } from '../core/Network.js'

import HeroUnit from '../entities/HeroUnit.js'
import Unit from '../entities/Unit.js'
import TowerUnit from '../entities/TowerUnit.js'
import BattleUnit from '../entities/BattleUnit.js'

import ViewportFollow from '../behaviours/ViewportFollow.js'
import SmoothMovement from '../behaviours/SmoothMovement.js'

export default class TitleScene extends PIXI.Container {

  constructor () {

    super()

    // grass background
    this.grass = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('grass.png'), 100, 100)
    this.addChild( this.grass )

    this.scenery = new PIXI.Container()
    this.addChild( this.scenery )

    this.entityLayer = new PIXI.Container()
    this.addChild( this.entityLayer )

    this.topLayer = new PIXI.Container()
    this.addChild( this.topLayer )

    this.entities = {}
    this.respawnCount = 0

    this.heroSide = null

    this.room = join( 'battle', { name: window.prompt("Enter your nickname") || "" } )

    this.room.on( 'update', this.onRoomUpdate.bind(this) )
    this.room.on( 'error', ( err ) => console.error( arguments ) )

    this.on( 'dispose', this.onDispose.bind(this) )

    // Play theme song
    App.sound.play('theme-song')

  }

  onRoomUpdate ( state, patches ) {

    if ( !patches ) {

      this.setupMap( state )

    } else {

      for ( let i=0; i < patches.length; i++ ) {

        let patch = patches [ i ]

        if ( patch.op === "replace" && patch.path.match(/\/winner/) ) {

          let message = ( patch.value === this.heroSide ) ? "You win!" : "You lost!"

          let text = new PIXI.Text( message, {
            font: '52px Arial',
            fill: config.colors [ patch.value ],
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
          } )

          text.anchor.set( 0.5 )
          text.x = window.innerWidth / 2
          text.y = window.innerHeight / 2

          this.parent.addChild ( text )

          // reload game in 5 seconds
          App.clock.setTimeout(() => { window.location.href = window.location.href }, 5000)

          return
        }

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

    this.grass.width = state.size.width
    this.grass.height = state.size.height

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

          this.heroSide = entity.side

          if ( this.respawnCount > 0 ) {
            App.sound.play('respawn')
          }

          this.respawnCount++
          this.addBehaviour( new ViewportFollow, entity )

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

        break;

      case "spawn-point":
        return false

        break;
    }

    if ( !entity ) {
      console.warn( "couldn't create entity. ", data )
      return
    }

    this.entityLayer.addChild( entity )
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
