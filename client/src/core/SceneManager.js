export default class SceneManager extends PIXI.Container {

  constructor (ratio) {
    super()

    this.scale.x = ratio
    this.scale.y = ratio

    this.currentScene = null
    this.nextScene = null

    this.sceneInstanceMap = {}
  }

  goTo (screenClass, options = {}) {
    var screenName = screenClass.name

    if (!this.sceneInstanceMap[ screenName ]) {
      this.sceneInstanceMap[ screenName ] = new screenClass

      this.bindEvents( this.sceneInstanceMap[ screenName ] )
    }

    if (this.currentScene) {
      this.nextScene = this.sceneInstanceMap[ screenName ]

      this.defaultTransitionOut(this.currentScene)
      this.defaultTransitionIn(this.nextScene).then(() => {
        this.currentScene = this.nextScene
        this.nextScene = null
      })

      // this.defaultTransitionIn.bind(this, this.nextScene)
      //   then(this.defaultTransitionIn.bind(this, this.nextScene))

    } else {
      this.currentScene = this.sceneInstanceMap[ screenName ]
      this.addChild(this.currentScene)
    }
  }

  bindEvents (scene) {
    scene.on('goto', (...args) => this.goTo.apply(this, args))
  }

  defaultTransitionIn (scene) {
    scene.alpha = 0
    this.addChild(scene)
    return tweener.add(scene).
      to({ alpha: 1 }, 800, Tweener.ease.easeQuintOut)
  }

  defaultTransitionOut (scene) {
    return tweener.add(scene).
      to({ alpha: 0 }, 800, Tweener.ease.easeQuintOut).then( () => {
        // dispose & remove all scene references on transition-out
        scene.emit('dispose')
        scene.off()

        this.removeChild(scene)
        delete this.sceneInstanceMap[ scene.constructor.name ]
      })
  }

}
