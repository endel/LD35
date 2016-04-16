"use strict";

var Room = require('colyseus').Room

  , ClockTimer = require('clock-timer.js')

  , StateHandler = require('./../handlers/StateHandler.js')

const TICK_RATE = 30

class BattleMapRoom extends Room {

  constructor (options) {
    super(options)

    this.heroes = new WeakMap()

    this.clock = new ClockTimer()
    this.setState(new StateHandler( this.clock, options.map ))

    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
    this.started = false
  }

  requestJoin (options) {

    return ( this.clients.length < 6 )

  }

  onJoin (client, options) {
    let side = ( this.clients.length % 2 == 1 ) ? 0 : 1

    this.heroes.set( client, this.state.createHero( {
      id: client.id,
      side: side,
      name: options.name
    } ) )

    console.log(client.id, 'joined', options)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]
      , hero = this.heroes.get( client )

    if (!hero) {
      console.log("ERROR: message comming from invalid hero.")
      return
    }

    if (key == 'pos') {

      this.state.move(hero, value, true)

    }

  }

  onLeave (client) {
    console.log(client.id, "left")
  }

  tick () {
    this.state.update()
  }

  dispose () {
    clearInterval(this.tickInterval)
    console.log("dispose BattleMapRoom", this.roomId)
  }

}

module.exports = BattleMapRoom
