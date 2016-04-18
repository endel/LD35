export default class UnitAttributes extends PIXI.Container {

  constructor ( attributes = { } ) {

    super()

    this.icon = PIXI.Sprite.fromImage('sword-shield.png')
    this.icon.anchor.set( 0.5 )
    this.icon.y = -5
    this.addChild( this.icon )

    this.text = new PIXI.Text( "0 / 0", {
      font: '11px Arial',
      fill: 0xffffff,
      align: 'center'
    } )
    this.text.anchor.set( 0.5 )
    this.text.y = 9
    this.text.x = 1
    this.addChild( this.text )

    this.updateAttributes( attributes )

  }

  updateAttributes ( attributes ) {

    this.attack = parseInt(attributes.attack) || 0
    this.defense = parseInt(attributes.defense) || 0

    this.text.text = `${this.attack} / ${this.defense}`

  }

}

