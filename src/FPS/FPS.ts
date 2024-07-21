import gameConfig from "../gameConfig";
import { Scene, GameObjects } from "phaser";

export default class FPS {
    private _time: {
        prev: number;
        fps: number;
        fpsText: GameObjects.Text | null;
    };

    constructor(private _scene: Scene) {
        this._time = {
            prev: 0,
            fps: 0,
            fpsText: null,
        };
    }

    showFps() {
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: `${8 * gameConfig.scaleRange}px`,
            color: '#333333',
        };

        this._time.prev = 0;
        this._time.fps = 0;
        this._time.fpsText = this._scene.add.text(
          20 * gameConfig.scaleRange,
          20 * gameConfig.scaleRange,
          'FPS:',
          textStyle
        );
    }

    updateFps(time: number) {
        if (this._time.fpsText) {
            this._time.fps = 1000 / (time - this._time.prev);
            this._time.prev = time;
            this._time.fpsText.setText('FPS: ' + Math.round(this._time.fps));
        }
    }

    getGraphicsObject() {
        return this._time.fpsText;
    }
}
