import Colyseus from 'colyseus.js'

const url = ( window.location.href.match(/localhost/) )
  ? "ws://localhost:3553"
  : window.location.protocol.replace("http", "ws") + "//" + window.location.hostname

let client = new Colyseus( url )
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
