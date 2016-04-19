const Unit = require('./Unit.js')

const config = require('../config.js')

var spawnInterval = new WeakMap()

class Tower extends Unit {

  constructor ( options ) {

    super ( options )

    this.type = 'tower'
    this.alive = true

    this.isSpawnAllowed = this.data.properties.spawn != 0
    this.isMainTower = !this.isSpawnAllowed
    this.isSpawning = true

    this.lastSpawnTime = 0
    this.lastWaveTime = 0

    this.spawnWaveInterval = config.spawnWaveInterval
    this.spawnInterval = config.spawnInterval
    this.spawnPerWave = config.spawnPerWave

  }

  setup ( state ) {

    // spawn feature might be disabled on this tower
    if ( this.isSpawnAllowed )  {

      state.clock.setInterval( this.toggleSpawner.bind(this, state) , this.spawnWaveInterval )
      this.toggleSpawner( state )

    }

  }

  toggleSpawner ( state ) {

    // don't spawn if tower is not alive
    if ( ! this.alive ) {
      return
    }

    spawnInterval.set( this, state.clock.setInterval( this.spawn.bind(this, state), this.spawnInterval ) )

    // clear spawn interval after wave is complete
    state.clock.setTimeout( () => { spawnInterval.get( this ).clear() }, this.spawnInterval * this.spawnPerWave )

  }

  spawn ( state ) {

    let creep = new Unit({
      lvl: this.lvl,
      x: this.position.x,
      y: this.position.y,
      properties: {
        isCreep: true,
        side: parseInt( this.side ),
        attack: this.lvl - Math.round( Math.random() ) + Math.round( Math.random() ),
        defense: this.lvl - Math.round( Math.random() ) + Math.round( Math.random() ),
      }
    })

    // creep destiny is always the opposite tower
    let enemyTowers = state.towers.filter( tower => tower.side !== this.side )
    let nextEnemyTower = enemyTowers.filter( tower => tower.position.x === this.position.x )

    creep.destiny = nextEnemyTower[0].position

    // if ( nextEnemyTower.length > 0 ) {
    //   creep.destiny = nextEnemyTower[0].position
    // } else {
    //   creep.destiny = enemyTowers[0].position
    // }


    state.addEntity( creep )

  }

}

module.exports = Tower
