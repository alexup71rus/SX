import gameConfig from "../gameConfig";
import { Scene } from "phaser";
import Sprite = Phaser.GameObjects.Sprite;

export default class Joystick {
    private _sprite: Sprite;
    private moveForce: number;
    private joystickDefaultPosition = { x: 0, y: 0 };
    private joystickVelocity: Phaser.Math.Vector2;
    private stopZone: number = 15 * gameConfig.scaleRange;
    private readonly radius: number = 40;

    constructor(private _scene: Scene) {}

    public handlerJoystick(sprite: Sprite, joystickVelocity: Phaser.Math.Vector2) {
        this._sprite = sprite;
        this.joystickVelocity = joystickVelocity;
        this.joystickDefaultPosition = {
            x: sprite.x,
            y: sprite.y
        };

        sprite.on('pointerdown', this.onDragJoystick.bind(this));
        sprite.on('drag', this.onDragJoystick.bind(this));
        sprite.on('dragend', this.onDragEndJoystick.bind(this));
    }

    onDragJoystick(pointer: Phaser.Input.Pointer) {
        // @ts-ignore
        const container = this._scene.uiContainer; // Получаем uiContainer из сцены
        if (!container) return;

        const localPointer = container.getWorldTransformMatrix().applyInverse(pointer.worldX, pointer.worldY);
        const dx = localPointer.x - this.joystickDefaultPosition.x;
        const dy = localPointer.y - this.joystickDefaultPosition.y; // Исправлено

        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {
            this._sprite.x = this.joystickDefaultPosition.x + (this.radius * Math.cos(angle));
            this._sprite.y = this.joystickDefaultPosition.y + (this.radius * Math.sin(angle));
        } else {
            this._sprite.x = localPointer.x;
            this._sprite.y = localPointer.y;
        }

        this.onUpdateJoystick(angle, distance);
    }

    onDragEndJoystick(pointer: Phaser.Input.Pointer) {
        this._sprite.x = this.joystickDefaultPosition.x;
        this._sprite.y = this.joystickDefaultPosition.y;

        this.onUpdateJoystick(0, 0);
    }

    onUpdateJoystick(angle: number, distance: number) {
        this.joystickVelocity.setToPolar(angle, distance); // Раскомментировано
        this.joystickVelocity.x = this.getJoystickForceX(this.joystickVelocity.x, this.stopZone);
        this.joystickVelocity.y = this.getJoystickForceY(this.joystickVelocity.y, this.stopZone);
    }

    getJoystickForceX(joystickX: number, stopZone: number) {
        if (joystickX > stopZone) {
            return 1;
        } else if (joystickX < -stopZone) {
            return -1;
        }
        return 0;
    }

    getJoystickForceY(joystickY: number, stopZone: number) {
        if (joystickY > stopZone) {
            return 1;
        } else if (joystickY < -stopZone) {
            return -1;
        }
        return 0;
    }
}
