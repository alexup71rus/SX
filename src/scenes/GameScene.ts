import { Scene } from 'phaser'
import * as events from "events";
import gameConfig from "../gameConfig";
import Map = Phaser.Structs.Map;

type SceneCreateProps = {
  isRestart?: boolean
}

export class GameScene extends Scene {
  // размер холста
  private gameWidth: number
  private gameHeight: number
  private inputBarHeight: number

  private graphics: any

  private gameSceneShape: any
  private backgroundSprite: any
  private playerSprite: any

  private bottomPanelButtons: Map<any, any>
  private keysLocked: boolean

  private _isGameOver: boolean

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
  }

  handlerJoystick() {
    const joystick = this.bottomPanelButtons.get('joystick-point');
    const radius = 50 * gameConfig.scaleRange
    const defaultPosition = {
      x: joystick.x,
      y: joystick.y
    }
    const onDrag = (pointer: any) => {
      let angle = Phaser.Math.Angle.Between(defaultPosition.x, defaultPosition.y, pointer.x, pointer.y)
      let distance = Phaser.Math.Distance.Between(defaultPosition.x, defaultPosition.y, pointer.x, pointer.y)

      if (distance > radius) {
        joystick.x = defaultPosition.x + (radius * Math.cos(angle))
        joystick.y = defaultPosition.y + (radius * Math.sin(angle))
      } else {
        joystick.x = pointer.x
        joystick.y = pointer.y
      }
    }

    joystick.setInteractive();
    this.input.setDraggable(joystick)

    joystick.on('pointerdown', onDrag)
    joystick.on('drag', onDrag)

    joystick.on('dragend', (pointer: any) => {
      joystick.x = defaultPosition.x
      joystick.y = defaultPosition.y
    })
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
      case 'ArrowUp':
        _return = 'jump';
        break;

      case 'ArrowDown':
        _return = 'block';
        break;

      case 'ArrowLeft':
        _return = 'kunai';
        break;

      case 'ArrowRight':
        _return = 'attack';
        break;
    }

    return _return
  }

  handlerKeysBottomPanel() {
    window.addEventListener('keydown', ev => {
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(inputCode => {
        if (ev.code === inputCode) {
          const btnKey = this.getKeyButtonCode(inputCode)
          const delayIsTrue = this.tweenButton(btnKey)
        }
      })
    })
  }

  onStartGame = async () => {
    const scene = this.scene.get('GameScene')
    this.gameWidth = gameConfig.screenWidth;
    this.gameHeight = gameConfig.screenHeight - (160 * gameConfig.scaleRange);
    this.inputBarHeight = gameConfig.screenHeight - this.gameHeight;
    this.graphics = this.add.graphics();
    this.input.addPointer(2);

    this.renderBottomPanel();
    this.drawScene()
    this.initEvents()
    this.resizeGameWindow()
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
    this._isGameOver = false

    this.onStartGame()
  }

  drawScene() {
    this.gameSceneShape = this.make.graphics({})
    this.backgroundSprite = this.add.image((this.gameWidth / 2), this.gameHeight / 2, 'scene1')

    this.gameSceneShape.fillStyle(0x000000)
    this.gameSceneShape.fillRoundedRect(0, 0, this.gameWidth, this.gameHeight, 40)

    this.backgroundSprite.setMask(this.gameSceneShape.createGeometryMask())
  }

  initEvents() {
    this.handlerBottomPanel()
    this.handlerKeysBottomPanel()
    this.handlerJoystick()
  }

  update(time: number, delta: number) {
    super.update(time, delta)
  }
}