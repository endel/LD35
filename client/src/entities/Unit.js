import UnitAttributes from './UnitAttributes.js'

export default class Unit extends PIXI.Container {

  constructor ( options, hasBorder = false ) {

    super()

    this.side = options.side

    this.circle = new PIXI.Graphics()

    if (hasBorder) {
      this.circle.lineStyle ( 1 , 0x000000, 0.8 );
    }

    this.circle.beginFill( config.colors[ options.side ] );
    this.circle.drawCircle( 0, 0, config.circleRadius );

    this.addChild( this.circle )

    this.attributes = new UnitAttributes( options )
    this.addChild( this.attributes )

  }

  set attack ( attack ) {

    this.attributes.updateAttributes( { attack: attack, defense: this.attributes.defense } )

  }

  set defense ( defense ) {

    this.attributes.updateAttributes( { attack: this.attributes.attack, defense: defense } )

  }

  set isBattling ( value ) {

    if ( value ) {

      App.tweens.add( this ).to( { alpha: 0 }, 200, Tweener.ease.quadOut )
      App.tweens.add( this.scale ).to( { x: 0.5, y: 0.5 }, 200, Tweener.ease.quadOut )

    } else {

      App.tweens.add( this ).to( { alpha: 1 }, 200, Tweener.ease.quadOut )
      App.tweens.add( this.scale ).to( { x: 1, y: 1 }, 200, Tweener.ease.quadOut )

    }

  }

  kill () {

    App.tweens.add( this.scale ).to( { x: 0.3, y: 0.3 }, 800, Tweener.ease.quadOut )

    App.tweens.add( this ).to( { alpha: 0 }, 800, Tweener.ease.quadOut ).then( () => {

      this.parent.removeChild( this )

    })

  }

}
