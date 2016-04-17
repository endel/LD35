const Unit = require('./Unit.js')

const config = require('../config.js')

var spawnInterval = new WeakMap()

class Tower extends Unit {

  constructor ( options ) {

    super ( options )

    this.type = 'tower'

    this.isSpawning = true

    this.lastSpawnTime = 0
    this.lastWaveTime = 0

    this.spawnWaveInterval = config.spawnWaveInterval
    this.spawnInterval = config.spawnInterval
    this.spawnPerWave = config.spawnPerWave

  }

  setup ( state ) {

    state.clock.setInterval( this.toggleSpawner.bind(this, state) , this.spawnWaveInterval )
    this.toggleSpawner( state )

  }

  toggleSpawner ( state ) {

    spawnInterval.set( this, state.clock.setInterval( this.spawn.bind(this, state), this.spawnInterval ) )

    // clear spawn interval after wave is complete
    state.clock.setTimeout( () => { spawnInterval.get( this ).clear() }, this.spawnInterval * this.spawnPerWave )

  }

  spawn ( state ) {

    let creep = new Unit({
      x: this.position.x,
      y: this.position.y,
      properties: {
        side: parseInt( this.side ),
        attack: 1 - Math.round( Math.random() ) + Math.round( Math.random() ),
        defense: 1 - Math.round( Math.random() ) + Math.round( Math.random() ),
      }
    })

    // creep destiny is always the opposite tower
    creep.destiny = state.towers.filter(tower => tower.side !== this.side)[0].position

    console.log("Spawn!", creep, creep.destiny)

    state.addEntity( creep )

  }

}

module.exports = Tower
