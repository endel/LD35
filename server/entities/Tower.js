const Unit = require('./Unit.js')

class Tower extends Unit {

  constructor ( options ) {

    super ( options )

    this.type = 'tower'

  }

}

module.exports = Tower
