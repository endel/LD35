import UnitAttributes from './UnitAttributes.js'

const radius = 24

export default class Unit extends PIXI.Container {

  constructor ( options, hasBorder = false ) {

    super()

    this.circle = new PIXI.Graphics()

    if (hasBorder) {
      this.circle.lineStyle ( 1 , 0x000000, 0.8 );
    }

    this.circle.beginFill( config.colors[ options.side ] );
    this.circle.drawCircle( 0, 0, radius );

    this.addChild( this.circle )

    this.attributes = new UnitAttributes( options )
    this.addChild( this.attributes )

  }

}
