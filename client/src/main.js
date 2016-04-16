import Resources from './core/Resources.js'
import TitleScene from './scenes/TitleScene.js'

Resources.load(function () {

  App.sceneManager.goTo( TitleScene )
  App.update()

})
