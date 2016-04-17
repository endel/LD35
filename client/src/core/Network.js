import Colyseus from 'colyseus.js'

let client = new Colyseus("ws://localhost:3553")
let connectedRoom = null

export function getClientId () {
  return client.id
}

export function join ( name, options = {} ) {
  connectedRoom = client.join( name, options )
  return connectedRoom
}

export function send ( data ) {
  connectedRoom.send ( data )
}
