const uniqid = require('uniqid')
const config = require('../config.js')

var battleInstances = new WeakMap()
var lastBattleAbandon = new WeakMap()

class Unit {

  constructor ( data ) {

    if ( typeof(data.properties.side) === "undefined" ) data.properties.side = 2

    this.position = { x: data.x, y: data.y }
    this.destiny = null

    this.isBattling = false
    this.isCreep = data.properties.isCreep || false

    this.lvl = data.lvl || 1
    this.pointsToDistribute = 0

    this.exp = 0
    this.expMax = 1

    this.type = 'unit'

    this.id = data.id || uniqid()
    this.data = data

    this.speed = 0.05
    this.attack = data.properties.attack || 0
    this.defense = data.properties.defense || 1

    this.side = parseInt( data.properties.side )

  }

  update ( state ) {

    //
    // TODO: improve me
    //
    // the tower on current unit's lane was destroyed,
    // find another destiny to follow, which is main opponent's tower
    //

    if ( this.isCreep && !this.destiny ) {

      let mainEnemyTower = state.towers.filter( tower => tower.side !== this.side && !tower.isSpawnAllowed )[ 0 ]

      this.destiny = {
        x: mainEnemyTower.position.x,
        y: mainEnemyTower.position.y
      }

    }

  }

  incrementExp ( exp ) {

    this.exp += exp

    if ( this.exp >= this.expMax ) {

      this.lvl ++
      this.pointsToDistribute ++

      this.exp = this.exp - this.expMax
      this.expMax += (this.lvl / 2)

    }

  }

  get isAvailableForBattle () {

    // units can join in battle again only after 1 sec abandoning
    return this.lastBattleAbandon + config.abandonImmunityTime < Date.now()

  }

  get lastBattleAbandon () {
    return lastBattleAbandon.get( this ) || 0
  }


  moveTo ( point ) {

    this.destiny = point

    if ( this.isBattling && this.lastBattleAbandon + config.abandonCooldown < Date.now() ) {

      battleInstances.get( this ).leave( this, true )
      lastBattleAbandon.set( this, Date.now() )

    }

  }

  set battle ( battle ) {

    battleInstances.set( this, battle )

  }

}

module.exports = Unit
