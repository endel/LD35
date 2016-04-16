const Unit = require('./Unit.js')

class Hero extends Unit {

  constructor ( options ) {

    super ( options )

    this.type = 'hero'
    this.name = options.name

  }

}

module.exports = Hero
