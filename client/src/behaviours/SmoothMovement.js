import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class SmoothMovement extends Behaviour {

  onAttach () {

    this.object.incoming = {}

  }

  update () {

    let nextPosition = this.object.incoming.position

    if ( nextPosition ) {
      if ( nextPosition.x ) this.object.x = lerp(this.object.x, nextPosition.x, 0.1)
      if ( nextPosition.y ) this.object.y = lerp(this.object.y, nextPosition.y, 0.1)
    }

  }

}
