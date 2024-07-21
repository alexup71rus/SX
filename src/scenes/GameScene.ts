import { Scene } from 'phaser'
import gameConfig from "../gameConfig";
import Map = Phaser.Structs.Map;
import FPS from "../FPS/FPS";
import PlayerController from "../Player/PlayerController";

type SceneCreateProps = {
  isRestart?: boolean,
  isSceneStarted?: boolean,
}

const sceneName = 'GameScene'

export class GameScene extends Scene {
  // размер холста
  readonly gameWidth: number = gameConfig.screenWidth
  readonly gameHeight: number = gameConfig.screenHeight - (160 * gameConfig.scaleRange)
  readonly inputBarHeight: number = gameConfig.screenHeight - (gameConfig.screenHeight - (160 * gameConfig.scaleRange))

  // графика
  public graphics: any
  public gameSceneShape: any
  public backgroundSprite: any

  // игровые объекты
  public collectGameObjects: Map<any, any>

  // логика сцены
  public _isSceneStarted: boolean = false

  async onRestartGame() {
    this.scene.restart({ isRestart: true })
  }

  constructor() {
    super(sceneName)
  }

  public create({ isRestart }: SceneCreateProps) {
    this.graphics = this.add.graphics();

    this.drawScene()
    this.initControllers()
    this.startControllers()
    this.bindEvents()
    this.resizeGameWindow()

    this._isSceneStarted = true
  }

  public resizeGameWindow() {
    this.children.list.forEach((child: any) => {
      child.setScale(gameConfig.scaleRange)
    });
  }

  private drawScene() {
    this.gameSceneShape = this.make.graphics({})
    this.backgroundSprite = this.add.image((this.gameWidth / 2), this.gameHeight / 2, 'scene1')

    this.gameSceneShape.fillStyle(0x000000)
    this.gameSceneShape.fillRoundedRect(
        0,
        (-40 * gameConfig.scaleRange),
        this.gameWidth,
        this.gameHeight + (40 * gameConfig.scaleRange),
        (40 * gameConfig.scaleRange)
    )

    this.backgroundSprite.setMask(this.gameSceneShape.createGeometryMask())
  }

  private startControllers() {
    this.collectGameObjects.get('fps').showFps()
    this.collectGameObjects.get('player').create()
  }

  private initControllers() {
    this.collectGameObjects = new Map([])

    this.collectGameObjects.set('fps', new FPS(this.scene.get(sceneName)))
    this.collectGameObjects.set('player', new PlayerController(this))
  }

  private bindEvents() {
  }

  public update(time: number, delta: number) {
    super.update(time, delta)

    if (this._isSceneStarted) {
      this.collectGameObjects.get('fps').updateFps(time)
      this.collectGameObjects.get('player').update(time, delta)
      this.cameras.main.startFollow(
        this.collectGameObjects.get('player').getPlayerPosition(), true, 0.1, 0.1
      );
    }
  }
}