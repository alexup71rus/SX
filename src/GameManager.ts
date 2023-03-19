import {Scene} from "phaser";
import Player from "./Player/Player";

export default class GameManager {
    private _scene: Scene
    private _player: Player
    private _isGameOver: boolean

    constructor(scene: Scene) {
        this._scene = scene
        this._isGameOver = false
    }

    async createControls() {

    }

    async createPlayer(x: number, y: number) {
        this._player = new Player(this._scene, {x: x, y: y})
        this._player.start();

        return this._player
    }

    async playerAttack() {
        return this._player.attack()
    }

    async playerJump() {
        return this._player.jump()
    }

    playerMove(time: number, delta: number, speed: number, velocity: Phaser.Math.Vector2) {
        let playerSpeedDelta = speed * (delta / 1000);
        let speedX: number = 0
        let speedY: number = 0

        if (velocity.x !== 0) {
            speedX = velocity.x > 0 ? playerSpeedDelta : -playerSpeedDelta
        }

        if (velocity.y !== 0) {
            speedY = velocity.y > 0 ? playerSpeedDelta : -playerSpeedDelta
        }


        this._player.move(speedX, speedY)
    }
}