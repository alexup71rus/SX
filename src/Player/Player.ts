import {GameObjects, Scene} from 'phaser';

type PlayerPositionStart = { x: number, y: number }
type PlayerProps = PlayerPositionStart

export default class Player extends GameObjects.Sprite
{
    private _health = 2

    constructor(scene: Scene, props: PlayerProps) {
        super(scene, props.x, props.y, 'player')

        this.scene.add.existing(this)
        this.setInteractive(true)
    }
}