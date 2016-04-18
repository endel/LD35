const Unit = require('./Unit.js')

class Hero extends Unit {

  constructor ( options ) {

    super ( options )

    this.type = 'hero'
    this.name = options.name

    this.lvl = 1
    this.speed = 0.15

    this.pointsToDistribute = 1

  }

  levelUp ( attribute ) {

    if ( this.pointsToDistribute > 0 ) {

      this[ attribute ]++
      this.pointsToDistribute--

    }

  }

}

module.exports = Hero
