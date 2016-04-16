import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class ViewportFollow extends Behaviour {

  onAttach ( entityToFollow ) {

    this.entityToFollow = entityToFollow

  }

  update () {

    this.object.x = lerp(this.object.x, -this.entityToFollow.x + window.innerWidth / 2, 0.1)
    this.object.y = lerp(this.object.y, -this.entityToFollow.y + window.innerHeight / 2, 0.1)

  }

  onDetach () {
  }

}

