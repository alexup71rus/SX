import gameConfig from "./gameConfig";
import Player from "./Player/Player";
import {GameScene} from "./scenes/GameScene";

export default class PlayerController extends GameScene
{
    // // ввод
    // private _playerSpeed: number = 60 * gameConfig.scaleRange
    // private joystickDefaultPosition = {x: 0, y: 0}
    // private joystickPosition = {x: 0, y: 0}
    // private joystickVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
    // private moveForce: number
    // private stopSone: number
    // private bottomPanelButtons: Map<any, any>
    // private keysLocked: boolean
    //
    // // игрок
    // private player: Player
    // private magicPlayerActions: { [K: string]: Function }
    //
    // renderBottomPanel = async () => {
    //     const bottomMargin = 30;
    //     this.bottomPanelButtons = new Map([]);
    //
    //     // buttons
    //     this.bottomPanelButtons.set('attack',
    //         this.add.sprite(
    //             this.gameWidth - (57 * gameConfig.scaleRange),
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 38) * gameConfig.scaleRange),
    //             'btn-attack'
    //         )
    //     )
    //     this.setButtonDelay('attack', 300)
    //     this.bottomPanelButtons.set('jump',
    //         this.add.sprite(
    //             this.gameWidth - (57 * gameConfig.scaleRange),
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 84) * gameConfig.scaleRange),
    //             'btn-jump'
    //         )
    //     )
    //     this.setButtonDelay('jump', 600)
    //     this.bottomPanelButtons.set('block',
    //         this.add.sprite(
    //             this.gameWidth - (152 * gameConfig.scaleRange),
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 38) * gameConfig.scaleRange),
    //             'btn-block'
    //         )
    //     )
    //     this.setButtonDelay('block', 150)
    //     this.bottomPanelButtons.set('kunai',
    //         this.add.sprite(
    //             this.gameWidth - (152 * gameConfig.scaleRange),
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 88) * gameConfig.scaleRange),
    //             'btn-kunai'
    //         )
    //     )
    //     this.setButtonDelay('kunai', 100)
    //
    //     // joystick
    //     this.bottomPanelButtons.set('joystick-place',
    //         this.add.sprite(
    //             (82 * gameConfig.scaleRange),
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 63) * gameConfig.scaleRange),
    //             'joystick-bg'
    //         )
    //     )
    //     this.bottomPanelButtons.set('joystick-point',
    //         this.add.sprite(
    //             82 * gameConfig.scaleRange,
    //             this.gameHeight + this.inputBarHeight - ((bottomMargin + 63) * gameConfig.scaleRange),
    //             'joystick-stick'
    //         )
    //     )
    //
    //     this.bottomPanelButtons.get('joystick-point').setInteractive();
    //     this.input.setDraggable(this.bottomPanelButtons.get('joystick-point'))
    //     this.joystickDefaultPosition = {
    //         x: this.bottomPanelButtons.get('joystick-point').x,
    //         y: this.bottomPanelButtons.get('joystick-point').y
    //     }
    // }
}