import Unit from './Unit.js'
import LevelUp from '../effects/LevelUp.js'

export default class HeroUnit extends Unit {

  constructor ( options ) {

    super( options, true )

    this.isCurrentPlayer = false

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

    this.addChild( this.name )

  }

  set lvl ( lvl ) {

    this._lvl = lvl
    this.levelUp ()

  }

  levelUp () {

    let lvlUp = new LevelUp( this.side, this.isCurrentPlayer )
    this.addChild( lvlUp )

  }

}


