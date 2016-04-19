import Unit from './Unit.js'
import LevelUp from '../effects/LevelUp.js'

import RespawnCountdown from '../behaviours/RespawnCountdown.js'

import { getClientId } from '../core/Network.js'

export default class HeroUnit extends Unit {

  constructor ( options ) {

    super( options, true )

    this.isCurrentPlayer = (getClientId() === options.id)

    this._lvl = 1

    this.name = new PIXI.Text(options.name, {
      font: '11px Arial',
      fill: 0xffffff,
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    })
    this.name.anchor.set( 0.5 )
    this.name.y = this.circle.y + this.circle.height / 2

    // show points to distribute when unit is created
    let i = options.pointsToDistribute
    while ( i-- ) { this.levelUp() }

    this.addChild( this.name )

    this.on('removed', this.onRemovedFromContainer.bind( this ) )

  }

  set lvl ( lvl ) {

    this._lvl = lvl
    this.levelUp ()

  }

  get lvl () {

    return this._lvl

  }

  levelUp () {

    if ( this.isCurrentPlayer ) {

      // Play theme song
      App.sound.play('levelup')

    }

    let lvlUp = new LevelUp( this.side, this.isCurrentPlayer )
    this.addChild( lvlUp )

  }

  onRemovedFromContainer ( container ) {

    this.getEntity().detachAll()

    if ( this.isCurrentPlayer ) {
      container.parent.getEntity().detachAll()
      container.parent.addBehaviour( new RespawnCountdown, this )
    }

  }

}


