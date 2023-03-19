import {GameObjects, Scene} from "phaser";
import gameConfig from "../gameConfig";
import {GameScene} from "../scenes/GameScene";
import PlayerSprite from "./PlayerSprite";
import Keyboard from "./Keyboard";
import Joystick from "./Joystick";

export default class PlayerController
{
    // player sprite
    private playerSprite: PlayerSprite

    // player game controller
    private _bottomPanelMargin: number = 30 // отступ контролов от нижнего края
    private joystickVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2() // запоминание сторон движения персонажа
    private speed: number = 60 * gameConfig.scaleRange // скорость движения персонажа
    private joystick: Joystick // обработчик движения с джойстика
    private keyboard: Keyboard// обработчик движения с клавиатуры
    private bottomPanelButtons: Map<any, any> // спрайты кнопок с панели управления персонажем
    private buttonsPressed: Map<any, any> // состояния кнопок с панели управления персонажем

    // отображаем спрайты панели управления
    renderBottomPanel() {
        // кнопки
        this.bottomPanelButtons.set('attack',
            this._scene.add.sprite(
                this._scene.gameWidth - (57 * gameConfig.scaleRange),
                this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 38) * gameConfig.scaleRange),
                'btn-attack'
            )
        )
        this.setButtonDelay('attack', 300)
            this.bottomPanelButtons.set('jump',
                this._scene.add.sprite(
                    this._scene.gameWidth - (57 * gameConfig.scaleRange),
                    this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 84) * gameConfig.scaleRange),
                    'btn-jump'
                )
            )
            this.setButtonDelay('jump', 600)
            this.bottomPanelButtons.set('block',
                this._scene.add.sprite(
                    this._scene.gameWidth - (152 * gameConfig.scaleRange),
                    this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 38) * gameConfig.scaleRange),
                    'btn-block'
                )
            )
            this.setButtonDelay('block', 150)
            this.bottomPanelButtons.set('kunai',
                this._scene.add.sprite(
                    this._scene.gameWidth - (152 * gameConfig.scaleRange),
                    this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 88) * gameConfig.scaleRange),
                    'btn-kunai'
                )
            )
            this.setButtonDelay('kunai', 100)

            // джойстик
            this.bottomPanelButtons.set('joystick-place',
                this._scene.add.sprite(
                    (82 * gameConfig.scaleRange),
                    this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 63) * gameConfig.scaleRange),
                    'joystick-bg'
                )
            )
            this.bottomPanelButtons.set('joystick-point',
                this._scene.add.sprite(
                    82 * gameConfig.scaleRange,
                    this._scene.gameHeight + this._scene.inputBarHeight - ((this._bottomPanelMargin + 63) * gameConfig.scaleRange),
                    'joystick-stick'
                )
            )
    }

    // создаю
    createGameController() {
        this.renderBottomPanel()

        // разрешаю тач двумя пальцами одновременно
        this._scene.input.addPointer(2);
        // делаю спрайт джойстика интерактивным на уровне движка
        this.bottomPanelButtons.get('joystick-point').setInteractive();
        this._scene.input.setDraggable(this.bottomPanelButtons.get('joystick-point'))
    }

    async spawnPlayer(x: number, y: number) {
        this.keyboard = new Keyboard(this._scene)
        this.joystick = new Joystick(this._scene)
        this.playerSprite = new PlayerSprite(this._scene, {x: x, y: y})
        this.playerSprite.start();
        this.playerSprite.setMask(this._scene.gameSceneShape.createGeometryMask())
        this.initEvents()
    }

    constructor(
        private _scene: GameScene,
    ) {}

    setButtonDelay(name: string, delay: integer) {
        this.bottomPanelButtons.get(name).pointerDelay = delay
    }

    initEvents() {
        // this.handlerBottomPanel()
        this.keyboard.handlerKeyboardMove(this.joystickVelocity)
        this.joystick.handlerJoystick(this.bottomPanelButtons.get('joystick-point'), this.joystickVelocity)
    }


    // метод вызывается каждый кадр
    // персонаж двигается на основании изменения переменной joystickVelocity
    playerMove(time: number, delta: number) {
        let playerSpeedDelta = this.speed * (delta / 1000);
        let speedX: number = 0
        let speedY: number = 0

        if (this.joystickVelocity.x !== 0) {
            speedX = this.joystickVelocity.x > 0 ? playerSpeedDelta : -playerSpeedDelta
        }

        if (this.joystickVelocity.y !== 0) {
            speedY = this.joystickVelocity.y > 0 ? playerSpeedDelta : -playerSpeedDelta
        }

        this.playerSprite.move(speedX, speedY)
    }

    async create() {
        this.bottomPanelButtons = new Map([]);

        this.createGameController()
        await this.spawnPlayer(this._scene.gameWidth / 2, this._scene.gameHeight - (200 * gameConfig.scaleRange))
    }

    update(time: number, delta: number) {
        this.playerMove(time, delta)
    }

    // setButtonDelay(name: string, delay: integer) {
    //     this.bottomPanelButtons.get(name).pointerDelay = delay
    // }
    //
    // tweenButton(btnKey: string, callback: Function, isLongLast?: number): boolean {
    //     const btn = this.bottomPanelButtons.get(btnKey)
    //     const tapDelay = 10
    //
    //     if (isLongLast === 2) {
    //         this.tweens.add({
    //             targets: btn,
    //             scale: (1 - .15) * gameConfig.scaleRange,
    //             duration: (btn.pointerDelay / 2),
    //             ease: 'Power1',
    //         })
    //     } else if (isLongLast === 1) {
    //         this.keysLocked = true
    //
    //         setTimeout(() => {
    //             this.keysLocked = false
    //             callback()
    //         }, btn.pointerDelay + tapDelay)
    //         this.tweens.add({
    //             targets: btn,
    //             scale: (1) * gameConfig.scaleRange,
    //             duration: (btn.pointerDelay / 2),
    //             ease: 'Power1',
    //         })
    //     } else {
    //         if (!this.keysLocked) {
    //             this.keysLocked = true
    //
    //             setTimeout(() => {
    //                 this.keysLocked = false
    //                 callback()
    //             }, btn.pointerDelay + tapDelay)
    //             this.tweens.add({
    //                 targets: btn,
    //                 scale: (1 + .15) * gameConfig.scaleRange,
    //                 duration: (btn.pointerDelay / 2),
    //                 ease: 'Power1',
    //                 yoyo: true
    //             })
    //         }
    //     }
    //
    //     return false
    // }
    //
    // handlerBottomPanel() {
    //     ['attack', 'jump', 'block', 'kunai'].forEach(inputCode => {
    //         const btn = this.bottomPanelButtons.get(inputCode).setInteractive();
    //
    //         btn.on('pointerdown', () => {
    //             const didAction = this.playerAction(inputCode, 'down')
    //         })
    //
    //         btn.on('pointerup', () => {
    //             const didAction = this.playerAction(inputCode, 'up')
    //         })
    //     });
    //
    //     ['UP', 'DOWN', 'LEFT', 'RIGHT'].forEach(inputCode => {
    //         this.input.keyboard.on('keydown-' + inputCode, () => {
    //             const didAction = this.playerAction(inputCode, 'down')
    //         });
    //
    //         this.input.keyboard.on('keyup-' + inputCode, () => {
    //             const didAction = this.playerAction(inputCode, 'up')
    //         });
    //     })
    // }
    //
    // playerAction(code: string, act?: string) {
    //     const action = this.getPlayerAction(code)
    //     const isLongLastAction = (action.name === 'attack' || action.name === 'block')
    //
    //     if (isLongLastAction && act === 'down') {
    //         const delayIsTrue = this.tweenButton(action.name, () => {
    //             this.getPlayerAction(code).action(1)
    //         }, 2)
    //         return this.getPlayerAction(code).action(2)
    //     } else if (isLongLastAction && act === 'up') {
    //         const delayIsTrue = this.tweenButton(action.name, () => {}, 1)
    //         return this.getPlayerAction(code).action(1)
    //     } else {
    //         const delayIsTrue = this.tweenButton(action.name, () => {}, 0)
    //         return this.getPlayerAction(code).action()
    //     }
    // }
    //
    // getPlayerAction(inputCode: string): any {
    //     let _return = {
    //         'name': '',
    //         'action': () => {
    //             console.error('Нет такого действия');
    //         }
    //     }
    //
    //     switch (inputCode) {
    //         case 'jump':
    //         case 'UP':
    //         case 'ArrowUp':
    //             _return = {
    //                 'name': 'jump',
    //                 'action': this._gameManager.playerJump.bind(this._gameManager)
    //             };
    //             break;
    //
    //         case 'block':
    //         case 'DOWN':
    //         case 'ArrowDown':
    //             _return = {
    //                 'name': 'block',
    //                 'action': this._gameManager.playerBlock.bind(this._gameManager)
    //             };
    //             break;
    //
    //         case 'kunai':
    //         case 'LEFT':
    //         case 'ArrowLeft':
    //             _return = {
    //                 'name': 'kunai',
    //                 'action': this._gameManager.playerKunai.bind(this._gameManager)
    //             };
    //             break;
    //
    //         case 'attack':
    //         case 'RIGHT':
    //         case 'ArrowRight':
    //             _return = {
    //                 'name': 'attack',
    //                 'action': this._gameManager.playerAttack.bind(this._gameManager)
    //             };
    //             break;
    //     }
    //
    //     return _return
    // }
}