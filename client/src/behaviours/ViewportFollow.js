import { Behaviour } from 'behaviour.js'
import { send } from '../core/Network.js'

import lerp from 'lerp'

import MoveToPoint from '../entities/MoveToPoint.js'

export default class ViewportFollow extends Behaviour {

  onAttach ( entityToFollow ) {

    this.moveRequest = new MoveToPoint( entityToFollow.side )
    this.entityToFollow = entityToFollow

    this.object.on( 'click', this.onClick.bind(this) )
    this.object.on( 'touchstart', this.onClick.bind(this) )
    this.object.interactive = true

  }

  update () {

    this.object.x = lerp(this.object.x, -this.entityToFollow.x + window.innerWidth / 2, 0.1)
    this.object.y = lerp(this.object.y, -this.entityToFollow.y + window.innerHeight / 2, 0.1)

  }

  onClick ( e ) {

    let point = {
      x: e.data.global.x - this.object.x,
      y: e.data.global.y - this.object.y
    }

    this.moveRequest.x = point.x
    this.moveRequest.y = point.y

    this.object.scenery.addChild( this.moveRequest )
    this.moveRequest.activate()

    send(['move', point])

  }

  onDetach () {
    console.log( "ViewportFollow detached!" )
  }

}

