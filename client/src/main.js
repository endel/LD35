import Resources from './core/Resources.js'
import TitleScene from './scenes/TitleScene.js'

import { Howl } from 'howler'
App.sound = new Howl( require('./data/audio.json') )

Resources.load(function () {

  App.sceneManager.goTo( TitleScene )
  App.update()

})
