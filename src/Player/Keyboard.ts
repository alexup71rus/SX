import {Scene} from "phaser";

export default class Keyboard
{
    private moveKeys: Map<any, any>
    private moveKeysPressed: Map<any, any>

    constructor(private _scene: Scene) {}

    handlerKeyboardMove(joystickVelocity: Phaser.Math.Vector2) {
        this.moveKeys = new Map([]);
        this.moveKeysPressed = new Map([]);

        ['W', 'A', 'S', 'D'].forEach(inputCode => {
            if (inputCode === 'W' || inputCode === 'A') {
                this.moveKeys.set(inputCode, {
                    dir: inputCode === 'W' ? 'y' : 'x',
                    force: -1
                })
            } else if (inputCode === 'S' || inputCode === 'D') {
                this.moveKeys.set(inputCode, {
                    dir: inputCode === 'S' ? 'y' : 'x',
                    force: 1
                })
            }

            this._scene.input.keyboard.on('keydown-' + inputCode, () => {
                const key = this.moveKeys.get(inputCode)

                this.moveKeysPressed.set(inputCode, key)

                key.dir === 'x'
                    ? joystickVelocity.x = key.force
                    : joystickVelocity.y = key.force
            });
            this._scene.input.keyboard.on('keyup-' + inputCode, () => {
                switch (inputCode) {
                    case 'W':
                        joystickVelocity.y = this.moveKeysPressed.get('S') !== undefined ? joystickVelocity.y : 0
                        break;
                    case 'A':
                        joystickVelocity.x = this.moveKeysPressed.get('D') !== undefined ? joystickVelocity.x : 0
                        break;
                    case 'S':
                        joystickVelocity.y = this.moveKeysPressed.get('W') !== undefined ? joystickVelocity.y : 0
                        break;
                    case 'D':
                        joystickVelocity.x = this.moveKeysPressed.get('A') !== undefined ? joystickVelocity.x : 0
                        break;
                }

                this.moveKeysPressed.delete(inputCode)
            });
        })
    }
}