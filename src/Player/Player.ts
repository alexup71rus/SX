import {GameObjects, Scene} from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import gameConfig from "../gameConfig";

type PlayerPositionStart = { x: number, y: number }
type PlayerProps = PlayerPositionStart

export default class Player extends GameObjects.Sprite
{
    private sprite: Sprite
    private _health = 2

    constructor(scene: Scene, props: PlayerProps) {
        super(scene, props.x, props.y, 'player')

        this.scene.add.existing(this)
        this.setInteractive()
    }

    move(forceX: integer, forceY: integer) {
        this.x = this.x + forceX
        this.y = this.y + forceY
    }
}