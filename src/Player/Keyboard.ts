import { Scene } from "phaser";

type MoveKeyConfig = {
    dir: 'x' | 'y';
    force: number;
};

export default class Keyboard {
    private moveKeys: Map<string, MoveKeyConfig>;
    private moveKeysPressed: Map<string, MoveKeyConfig>;

    constructor(private _scene: Scene) {
        this.moveKeys = new Map<string, MoveKeyConfig>();
        this.moveKeysPressed = new Map<string, MoveKeyConfig>();
    }

    handlerKeyboardMove(joystickVelocity: Phaser.Math.Vector2) {
        const movementKeys = ['W', 'A', 'S', 'D'];
        movementKeys.forEach(inputCode => {
            const keyboard = this._scene.input.keyboard;
            const config: MoveKeyConfig = {
                dir: inputCode === 'W' || inputCode === 'S' ? 'y' : 'x',
                force: inputCode === 'W' || inputCode === 'A' ? -1 : 1
            };
            this.moveKeys.set(inputCode, config);

            if (keyboard) {
                keyboard.on('keydown-' + inputCode, () => this.onKeyDown(inputCode, joystickVelocity));
                keyboard.on('keyup-' + inputCode, () => this.onKeyUp(inputCode, joystickVelocity));
            }
        });
    }

    private onKeyDown(inputCode: string, joystickVelocity: Phaser.Math.Vector2): void {
        const key = this.moveKeys.get(inputCode);
        if (key) {
            this.moveKeysPressed.set(inputCode, key);
            key.dir === 'x' ? joystickVelocity.x = key.force : joystickVelocity.y = key.force;
        }
    }

    private onKeyUp(inputCode: string, joystickVelocity: Phaser.Math.Vector2): void {
        const oppositeKey = this.getOppositeKey(inputCode);
        if (oppositeKey) {
            joystickVelocity[oppositeKey.dir] = this.moveKeysPressed.has(oppositeKey.code) ? joystickVelocity[oppositeKey.dir] : 0;
        }
        this.moveKeysPressed.delete(inputCode);
    }

    private getOppositeKey(inputCode: string): { code: string, dir: 'x' | 'y' } | undefined {
        switch (inputCode) {
            case 'W':
                return { code: 'S', dir: 'y' };
            case 'A':
                return { code: 'D', dir: 'x' };
            case 'S':
                return { code: 'W', dir: 'y' };
            case 'D':
                return { code: 'A', dir: 'x' };
            default:
                return undefined;
        }
    }
}
