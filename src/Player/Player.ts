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
        super(scene, props.x, props.y, 'player', 0)

        this.scene.add.existing(this)
        this.setInteractive()
        this.createAnimaitons();
    }

    createAnimaitons() {
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,
                end: 2,
                frames: [1,2,0]
            }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', {
                start: 2,
                frames: [3,4,0]
            }),
            frameRate: 5,
            repeat: 0
        })
    }

    move(forceX: integer, forceY: integer) {
        this.x = this.x + forceX
        this.y = this.y + forceY
    }

    attack() {
        this.play('attack')
    }

    jump() {
        this.play('jump')
    }
}