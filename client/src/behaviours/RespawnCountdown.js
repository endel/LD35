import { Behaviour } from 'behaviour.js'

export default class RespawnCountdown extends Behaviour {

  onAttach ( hero ) {

    this.time = hero.lvl

    this.respawnText = new PIXI.Text("", {
      font: '24px Arial',
      fill: 0xffffff,
      align: 'center',
      stroke: config.colors [ hero.side ],
      strokeThickness: 3
    })
    this.respawnText.x = hero.x
    this.respawnText.y = hero.y
    this.respawnText.anchor.set( 0.5 )

    this.object.topLayer.addChild( this.respawnText )

    this.decrement()

    this.interval = App.clock.setInterval( () => this.decrement(), 1000 )

  }

  decrement () {

    if ( this.time === 0 ) {
      this.respawnText.parent.removeChild ( this.respawnText )
      this.detach()
    }

    this.time--

    this.respawnText.text = `Will respawn in ${ this.time }...`

  }

  onDetach () {

    this.interval.clear()

  }

}

