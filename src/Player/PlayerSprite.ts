import {GameObjects, Scene} from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import gameConfig from "../gameConfig";

type PlayerPositionStart = { x: number, y: number }
type PlayerProps = PlayerPositionStart

export default class PlayerSprite extends GameObjects.Sprite
{
    private sprite: Sprite
    private _health = 2

    constructor(scene: Scene, props: PlayerProps) {
        super(scene, props.x, props.y, 'player', 0)

        this.scene.add.existing(this)
        this.setInteractive()
    }

    start() {
    }

    move(forceX: integer, forceY: integer) {
        if (this.x === this.x + forceX && this.y === this.y + forceY) {
            return false
        }

        this.x = this.x + forceX
        this.y = this.y + forceY
    }
}