const uniqid = require('uniqid')
const config = require('../config.js')

var _units = new WeakMap()
var interval = new WeakMap()
var _state = new WeakMap()

class Battle {

  constructor ( state ) {

    this.id = uniqid()
    this.type = "battle"

    _state.set( this, state )
    interval.set( this, state.clock.setInterval( this.attack.bind( this, state ), config.attackInterval ) )

    this.position = { x: null, y: null }

    this.percentage = 0.5
    this.hp = {}

    this.units = {}

    _units.set(this, [])

  }

  join ( unit ) {

    unit.isBattling = true
    unit.battle = this

    this.units[ unit.id ] = true

    if ( ! this.hp[ unit.side ] ) {

      this.hp[ unit.side ] = unit.defense

    } else {

      this.hp[ unit.side ] += unit.defense
    }


    _units.get( this ).push( unit )

  }

  leave ( unit, isAbandoning ) {

    if ( typeof ( isAbandoning ) === "undefined" ) {
      isAbandoning = false
    }

    unit.isBattling = false

    let arr = _units.get( this )
    arr.splice( arr.indexOf( unit ), 1 )

    delete this.units[ unit.id ]

    if ( isAbandoning ) {
      this.hp[ unit.side ] -= unit.defense
    }

    if ( arr.length == 1 ) {

      // just one left, leave this one
      // and then destroy battle unit

      this.leave( arr[0], false )

      _state.get( this ).removeEntity ( this )

    }


  }

  attack ( state ) {

    let units = _units.get( this )

    if ( units.length <= 1) {
      console.log("attack: invalid battle...")
      return
    }

    let unitsSide1 = units.filter(unit => unit.side === units[ 0 ].side)
    let side1 = unitsSide1[ 0 ].side

    let unitsSide2 = units.filter(unit => unit.side !== units[ 0 ].side)
    let side2 = unitsSide2[ 0 ].side

    console.log("side1: ", side1, "side2: ", side2 )

    //
    // TODO: process "first-strike"
    //

    this.hp[ side1 ] -= this.getUnitsAttribute ( unitsSide2, 'attack' )
    this.hp[ side2 ] -= this.getUnitsAttribute ( unitsSide1, 'attack' )

    let side1Percent = this.hp[ side1 ] / this.getUnitsAttribute ( unitsSide1, 'defense' )
    let side2Percent = this.hp[ side2 ] / this.getUnitsAttribute ( unitsSide2, 'defense' )

    this.percentage = ( side1Percent + side2Percent ) / 2

    if ( this.hp[ side1 ] < 0 ) {
      unitsSide1.map( unit => state.removeEntity ( unit ))
      unitsSide2.map( unit => this.leave( unit ) )
      this.destroy()
    }

    if ( this.hp[ side2 ] < 0 ) {
      unitsSide2.map( unit => state.removeEntity ( unit ))
      unitsSide1.map( unit => this.leave( unit ) )
      this.destroy()
    }

  }

  destroy (  ) {
    _state.get( this ).removeEntity ( this )
    interval.get( this ).clear()
  }

  getUnitsAttribute ( units, attribute ) {

    return units.reduce( (previousValue, currentUnit, currentIndex) => {
      return previousValue + currentUnit[ attribute ]
    } , 0)

  }

  // toJSON () {
  // }

}

module.exports = Battle
