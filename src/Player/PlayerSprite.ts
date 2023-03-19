import {GameObjects, Scene} from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import gameConfig from "../gameConfig";

type PlayerPositionStart = { x: number, y: number }
type PlayerProps = PlayerPositionStart

export default class PlayerSprite extends GameObjects.Sprite
{
    private sprite: Sprite
    private _health = 2
    private _playAnimation = '';

    constructor(scene: Scene, props: PlayerProps) {
        super(scene, props.x, props.y, 'player', 0)

        this.scene.add.existing(this)
        this.setInteractive()
        this.createAnimaitons();
    }

    createAnimaitons() {
        const matrixMapLingth = 5;
        const animMatrix = new Map()

        animMatrix.set('idle', {
            frames: [0,1,2,3], // 0 - 9
            frameRate: 5,
            repeat: -1,
        })
        animMatrix.set('run', {
            frames: [10,11,12,13], // 10 - 19
            frameRate: 5,
            repeat: -1,
        })
        animMatrix.set('jump', {
            frames: [20,21,22,23,24], // 20 - 29
            frameRate: 10,
        })
        animMatrix.set('swing', {
            frames: [30,31],
            frameRate: 5,
        })
        animMatrix.set('attack', {
            frames: [32,33,34,35,36,37,31],
            frameRate: 15,
        })
        animMatrix.set('parry', {
            frames: [40,41,42,43],
            frameRate: 15,
        })
        animMatrix.set('block', {
            frames: [44,45,46],
            frameRate: 15,
        })

        animMatrix.forEach((obj, key) => {
            this.anims.create({
                key: key,
                skipMissedFrames: true,
                frames: this.anims.generateFrameNumbers('player', {
                    frames: obj.frames
                }),
                frameRate: obj.frameRate !== undefined ? obj.frameRate : 10,
                repeat: obj.repeat !== undefined ? obj.repeat : 0
            });
        })
    }

    start() {
        this.idle().on('animationcomplete', this.onAnimationComplete.bind(this));
    }

    onAnimationComplete() {
        if (false) {
        } else {
            this.idle()
        }
    }

    playAnimation(key: string) {
        if (this._playAnimation === key) return this

        // console.log('key', key)

        this._playAnimation = key
        return this.play(key)
    }

    move(forceX: integer, forceY: integer) {
        if (this.x === this.x + forceX && this.y === this.y + forceY) {
            if (this._playAnimation === 'run') {
                this.idle()
            }

            return false
        }

        if (this._playAnimation !== 'idle' && this._playAnimation !== 'run') {
            return false
        }

        this.x = this.x + forceX
        this.y = this.y + forceY

        return this.playAnimation('run')
    }

    idle() {
        return this.playAnimation('idle')
    }

    swing() {
        return this.playAnimation('swing')
    }

    attack() {
        return this.playAnimation('attack')
    }

    parry() {
        return this.playAnimation('parry')
    }

    block() {
        return this.playAnimation('block')
    }

    jump() {
        return this.playAnimation('jump')
    }

    kunai() {
        return this.playAnimation('jump')
    }
}