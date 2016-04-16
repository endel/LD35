import Colyseus from 'colyseus.js'

let client = new Colyseus("ws://localhost:3553")

export function getClientId () {
  return client.id
}

export function join ( name, options = {} ) {
  return client.join( name, options )
}
