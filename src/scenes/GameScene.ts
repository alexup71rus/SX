import { Scene } from 'phaser'
import gameConfig from "../gameConfig";
import Map = Phaser.Structs.Map;
import GameManager from "../GameManager";

type SceneCreateProps = {
  isRestart?: boolean
}

export class GameScene extends Scene {
  // размер холста
  private gameWidth: number
  private gameHeight: number
  private inputBarHeight: number

  // game manager
  private _isSceneStarted: boolean = false
  private _gameManager: GameManager

  // отрисовка
  private _time: any = {
    prev: 0,
    fps: 0,
    fpsText: Text,
  }
  private graphics: any
  private gameSceneShape: any
  private backgroundSprite: any

  // ввод
  private _playerSpeed: number = 50 * gameConfig.scaleRange
  private joystickDefaultPosition = {x: 0, y: 0}
  private joystickPosition = {x: 0, y: 0}
  private joystickVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
  private bottomPanelButtons: Map<any, any>
  private keysLocked: boolean

  renderBottomPanel = async () => {
    const bottomMargin = 30;
    this.bottomPanelButtons = new Map([]);

    // buttons
    this.bottomPanelButtons.set('attack',
        this.add.sprite(
            this.gameWidth - (57 * gameConfig.scaleRange),
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 38) * gameConfig.scaleRange),
            'btn-attack'
        )
    )
    this.setButtonDelay('attack', 300)
    this.bottomPanelButtons.set('jump',
        this.add.sprite(
            this.gameWidth - (57 * gameConfig.scaleRange),
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 84) * gameConfig.scaleRange),
            'btn-jump'
        )
    )
    this.setButtonDelay('jump', 300)
    this.bottomPanelButtons.set('block',
        this.add.sprite(
            this.gameWidth - (152 * gameConfig.scaleRange),
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 38) * gameConfig.scaleRange),
            'btn-block'
        )
    )
    this.setButtonDelay('block', 150)
    this.bottomPanelButtons.set('kunai',
        this.add.sprite(
            this.gameWidth - (152 * gameConfig.scaleRange),
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 88) * gameConfig.scaleRange),
            'btn-kunai'
        )
    )
    this.setButtonDelay('kunai', 100)

    // joystick
    this.bottomPanelButtons.set('joystick-place',
        this.add.sprite(
            (82 * gameConfig.scaleRange),
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 63) * gameConfig.scaleRange),
            'joystick-bg'
        )
    )
    this.bottomPanelButtons.set('joystick-point',
        this.add.sprite(
            82 * gameConfig.scaleRange,
            this.gameHeight + this.inputBarHeight - ((bottomMargin + 63) * gameConfig.scaleRange),
            'joystick-stick'
        )
    )

    this.bottomPanelButtons.get('joystick-point').setInteractive();
    this.input.setDraggable(this.bottomPanelButtons.get('joystick-point'))
    this.joystickDefaultPosition = {
      x: this.bottomPanelButtons.get('joystick-point').x,
      y: this.bottomPanelButtons.get('joystick-point').y
    }
  }


  getJoystickForceX(joystickX: integer, force: number, stopSone: number) {
    if (joystickX > stopSone) {
      return 1 + force
    } else if (joystickX < -stopSone) {
      return -1 - force
    }

    return 0;
  }

  getJoystickForceY(joystickY: integer, force: number, stopSone: number) {
    if (joystickY > stopSone) {
      return 1 + force
    } else if (joystickY < -stopSone) {
      return -1 - force
    }

    return 0;
  }

  onUpdateJoystick(angle: integer, distance: integer) {
    const force = 2 * gameConfig.scaleRange
    const stopSone = 15 * gameConfig.scaleRange
    this.joystickVelocity.setToPolar(angle, distance);
    this.joystickVelocity.x = this.getJoystickForceX(this.joystickVelocity.x, force, stopSone)
    this.joystickVelocity.y = this.getJoystickForceY(this.joystickVelocity.y, force, stopSone)
  }

  onDragJoystick(pointer: any) {
    const joystick = this.bottomPanelButtons.get('joystick-point');
    const radius = 40 * gameConfig.scaleRange
    const angle = Phaser.Math.Angle.Between(
        this.joystickDefaultPosition.x,
        this.joystickDefaultPosition.y,
        pointer.x,
        pointer.y
    )
    const distance = Phaser.Math.Distance.Between(
        this.joystickDefaultPosition.x,
        this.joystickDefaultPosition.y,
        pointer.x,
        pointer.y
    )

    if (distance > radius) {
      joystick.x = this.joystickDefaultPosition.x + (radius * Math.cos(angle))
      joystick.y = this.joystickDefaultPosition.y + (radius * Math.sin(angle))
    } else {
      joystick.x = pointer.x
      joystick.y = pointer.y
    }

    this.onUpdateJoystick(angle, distance)
  }

  onDragEndJoystick(pointer: any) {
    const joystick = this.bottomPanelButtons.get('joystick-point');

    joystick.x = this.joystickDefaultPosition.x
    joystick.y = this.joystickDefaultPosition.y

    this.onUpdateJoystick(0, 0)
  }

  handlerJoystick() {
    this.bottomPanelButtons.get('joystick-point').on('pointerdown', this.onDragJoystick.bind(this))
    this.bottomPanelButtons.get('joystick-point').on('drag', this.onDragJoystick.bind(this))
    this.bottomPanelButtons.get('joystick-point').on('dragend', this.onDragEndJoystick.bind(this))
  }

  setButtonDelay(name: string, delay: integer) {
    this.bottomPanelButtons.get(name).pointerDelay = delay
  }

  tweenButton(btnKey: string): boolean {
    const btn = this.bottomPanelButtons.get(btnKey)
    const tapDelay = 10

    if (!this.keysLocked) {
      this.keysLocked = true
      setTimeout(() => this.keysLocked = false, btn.pointerDelay + tapDelay)

      this.tweens.add({
        targets: btn,
        scale: (1 + .15) * gameConfig.scaleRange,
        duration: (btn.pointerDelay / 2),
        ease: 'Power1',
        yoyo: true
      })

      return true
    }

    return false
  }

  handlerBottomPanel() {
    ['attack', 'jump', 'block', 'kunai'].forEach(btnKey => {
      const btn = this.bottomPanelButtons.get(btnKey).setInteractive();

      btn.on('pointerdown', () => {
        const delayIsTrue = this.tweenButton(btnKey)
      })
    });
  }

  getKeyButtonCode(inputCode: string): string {
    let _return = ''

    switch (inputCode) {
      case 'UP':
      case 'ArrowUp':
        _return = 'jump';
        break;

      case 'DOWN':
      case 'ArrowDown':
        _return = 'block';
        break;

      case 'LEFT':
      case 'ArrowLeft':
        _return = 'kunai';
        break;

      case 'RIGHT':
      case 'ArrowRight':
        _return = 'attack';
        break;
    }

    return _return
  }

  handlerKeysBottomPanel() {
    ['UP', 'DOWN', 'LEFT', 'RIGHT'].forEach(inputCode => {
      this.input.keyboard.on('keydown-' + inputCode, () => {
        const btnKey = this.getKeyButtonCode(inputCode)
        const delayIsTrue = this.tweenButton(btnKey)
      });
    })
  }

  onStartGame = async () => {
    this._gameManager = new GameManager(this.scene.get('GameScene'))
    this.gameWidth = gameConfig.screenWidth;
    this.gameHeight = gameConfig.screenHeight - (160 * gameConfig.scaleRange);
    this.inputBarHeight = gameConfig.screenHeight - this.gameHeight;
    this.graphics = this.add.graphics();
    this.input.addPointer(2);

    await this.renderBottomPanel()
    this.drawScene()
    await this.spawnPlayer()
    this.initEvents()
    this.showFps()
    this.resizeGameWindow()

    this._isSceneStarted = true
  }

  showFps() {
    const textStyle = {
      fontFamily: 'Arial',
      fontSize: ''+ (8 * gameConfig.scaleRange)+'px',
      color: '#ffffff'
    };

    this._time.prev = 0;
    this._time.fps = 0;
    this._time.fpsText = this.add.text(20 * gameConfig.scaleRange, 20 * gameConfig.scaleRange, 'FPS:', textStyle);
  }

  updateFps(time: number) {
    if (this._isSceneStarted) {
      // Рассчитываем количество кадров в секунду
      this._time.fps = 1000 / (time - this._time.prev);
      this._time.prev = time;

      // Обновляем текст с количеством кадров в секунду
      this._time.fpsText.setText('FPS: ' + Math.round(this._time.fps));
    }
  }

  async spawnPlayer() {
    let player = await this._gameManager.createPlayer(this.gameWidth / 2, this.gameHeight - (100 * gameConfig.scaleRange))

    player.setMask(this.gameSceneShape.createGeometryMask())
  }

  async resizeGameWindow() {
    this.children.list.forEach((child: any) => {
      child.setScale(gameConfig.scaleRange)
    });
  }

  onRestartGame = () => {
    this.scene.restart({ isRestart: true })
  }

  constructor() {
    super('GameScene')
  }

  async create({ isRestart }: SceneCreateProps) {
    this.onStartGame()
  }

  drawScene() {
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

  initEvents() {
    this.handlerBottomPanel()
    this.handlerKeysBottomPanel()
    this.handlerJoystick()
  }

  updatePlayer(time: number, delta: number) {
    if (!this._isSceneStarted) return false

    this._gameManager.playerMove(time, delta, this._playerSpeed, this.joystickVelocity)
  }

  update(time: number, delta: number) {
    super.update(time, delta)

    this.updateFps(time)
    this.updatePlayer(time, delta)
  }
}