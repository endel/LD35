import { join, getClientId } from '../core/Network.js'

export default class BattleScene extends PIXI.Container {

  constructor () {

    super()

    this.room = join( 'battle' )

    this.room.on( 'update', this.onRoomUpdate.bind(this) )
    this.room.on( 'error', ( err ) => console.error( arguments ) )

    this.on('dispose', this.onDispose.bind(this))

  }

  onRoomUpdate () {
  }

  onDispose () {
  }

}
