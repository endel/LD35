import UnitAttributes from './UnitAttributes.js'

const radius = 50
const size = radius * 2

export default class BattleUnit extends PIXI.Container {

  constructor ( units = [], hasBorder = false ) {

    super()

    //
    // create circles (player & enemy)
    //

    this.circlePlayer = new PIXI.Graphics()
    if (hasBorder) { this.circlePlayer.lineStyle ( 1 , 0x000000, 0.8 ); }
    this.circlePlayer.beginFill( config.colors.player );
    this.circlePlayer.drawCircle( 0, 0, radius );
    this.addChild( this.circlePlayer )

    this.circleEnemy = new PIXI.Graphics()
    if (hasBorder) { this.circleEnemy.lineStyle ( 1 , 0x000000, 0.8 ); }
    this.circleEnemy.beginFill( config.colors.enemy );
    this.circleEnemy.drawCircle( 0, 0, radius );
    this.addChild( this.circleEnemy )

    //
    // create set masks (player & enemy)
    //

    this.circlePlayerMask = new PIXI.Graphics()
    this.circlePlayerMask.beginFill( 0x000000 );
    this.circlePlayerMask.drawRect( -radius, -radius, size, size);
    this.circlePlayer.mask = this.circlePlayerMask
    this.addChild( this.circlePlayerMask )

    this.circleEnemyMask = new PIXI.Graphics()
    this.circleEnemyMask.beginFill( 0x000000 );
    this.circleEnemyMask.drawRect( -radius, -radius, size, size);
    this.circleEnemy.mask = this.circleEnemyMask
    this.addChild( this.circleEnemyMask )

    //
    // create attributes
    //
    this.playerAttributes = new UnitAttributes()
    this.playerAttributes.y = - radius / 2 + 3
    this.addChild( this.playerAttributes )

    this.enemyAttributes = new UnitAttributes()
    this.enemyAttributes.y = radius / 2 - 3
    this.addChild( this.enemyAttributes )

    this.updateUnits( units )

    this.setPercentage( 0.5 )

  }

  setPercentage ( percentage ) {

    App.tweens.add( this.scale ).from( { x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut )

    this.percentage = percentage

    this.circlePlayerMask.scale.y = percentage
    this.circlePlayerMask.y = -radius * ( 1 - percentage )

    this.circleEnemyMask.scale.y = 1 - percentage
    this.circleEnemyMask.y = radius * percentage

  }

  updateUnits ( units ) {

    App.tweens.add( this.scale ).from( { x: 1.3, y: 1.3 }, 500, Tweener.ease.quadOut )

    let teams = [{ attack: 0, defense: 0 }, { attack: 0, defense: 0 }]
    units.map( unit => {
      teams[ unit.team ].defense += unit.defense
      teams[ unit.team ].attack += unit.attack
    } )

    this.playerAttributes.updateAttributes(teams[0])
    this.enemyAttributes.updateAttributes(teams[1])

  }

}



