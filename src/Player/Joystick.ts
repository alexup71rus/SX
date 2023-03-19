import gameConfig from "../gameConfig";
import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;

export default class Joystick
{
    private _sprite: Sprite
    private moveForce: number
    private joystickDefaultPosition = {x: 0, y: 0}
    private joystickPosition = {x: 0, y: 0}
    private joystickVelocity: Phaser.Math.Vector2
    private stopSone: number = 15 * gameConfig.scaleRange

    constructor(private _scene: Scene) {
    }

    public handlerJoystick(sprite: Sprite, joystickVelocity: Phaser.Math.Vector2) {
        this._sprite = sprite
        this.joystickVelocity = joystickVelocity
        this.joystickDefaultPosition = {
            x: sprite.x,
            y: sprite.y
        }

        sprite.on('pointerdown', this.onDragJoystick.bind(this))
        sprite.on('drag', this.onDragJoystick.bind(this))
        sprite.on('dragend', this.onDragEndJoystick.bind(this))
    }

    onDragJoystick(pointer: any) {
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
            this._sprite.x = this.joystickDefaultPosition.x + (radius * Math.cos(angle))
            this._sprite.y = this.joystickDefaultPosition.y + (radius * Math.sin(angle))
        } else {
            this._sprite.x = pointer.x
            this._sprite.y = pointer.y
        }

        this.onUpdateJoystick(angle, distance)
    }

    onDragEndJoystick(pointer: any) {
        this._sprite.x = this.joystickDefaultPosition.x
        this._sprite.y = this.joystickDefaultPosition.y

        this.onUpdateJoystick(0, 0)
    }

    onUpdateJoystick(angle: integer, distance: integer) {
        this.joystickVelocity.setToPolar(angle, distance);
        this.joystickVelocity.x = this.getJoystickForceX(this.joystickVelocity.x, this.stopSone)
        this.joystickVelocity.y = this.getJoystickForceY(this.joystickVelocity.y, this.stopSone)
    }

    getJoystickForceX(joystickX: integer, stopSone: number) {
        if (joystickX > stopSone) {
            return 1
        } else if (joystickX < -stopSone) {
            return -1
        }

        return 0;
    }

    getJoystickForceY(joystickY: integer, stopSone: number) {
        if (joystickY > stopSone) {
            return 1
        } else if (joystickY < -stopSone) {
            return -1
        }

        return 0;
    }
}