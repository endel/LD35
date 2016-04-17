export default class MoveToPoint extends PIXI.Container {

  constructor ( side ) {

    super()

    this.side = side

    this.circle = new PIXI.Graphics()
    this.circle.beginFill( config.colors[ side ] );
    this.circle.drawCircle( 0, 0, config.circleRadius * 2 );
    this.circle.alpha = 0.5
    this.circle.pivot.set( 0.5 )
    this.addChild( this.circle )

    this.icon = PIXI.Sprite.fromImage('move-to.png')
    this.icon.tint = config.colors[ side ]
    this.icon.anchor.set( 0.5 )
    this.addChild( this.icon )

  }

  activate () {

    App.tweens.remove( this )
    App.tweens.remove( this.icon )
    App.tweens.remove( this.circle )

    this.rotation = 0
    this.alpha = 1
    this.icon.scale.set(1)
    this.circle.scale.set(1)

    App.tweens.add( this.icon.scale ).from( { x: 1.4, y: 1.4 }, 500, Tweener.ease.quadOut)
    App.tweens.add( this.circle.scale ).from( { x: 0.3, y: 0.3 }, 500, Tweener.ease.bounceOut)

    App.tweens.add( this ).
      from( { alpha: 0.05, rotation: 0.3 }, 500, Tweener.ease.quadOut).
      wait(200).
      to( { alpha: 0, rotation: -0.08 }, 300, Tweener.ease.quadOut ).then( () => {
        this.parent.removeChild( this )
      } )


  }

}
