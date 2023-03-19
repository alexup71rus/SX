import gameConfig from "../gameConfig";
import {Scene} from "phaser";

export default class FPS
{
    private _time: any = {
        prev: 0,
        fps: 0,
        fpsText: Text,
    }

    constructor(
        private _scene: Scene
    ) {
    }

    showFps() {
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: ''+ (8 * gameConfig.scaleRange)+'px',
            color: '#ffffff'
        };

        this._time.prev = 0;
        this._time.fps = 0;
        this._time.fpsText = this._scene.add.text(20 * gameConfig.scaleRange, 20 * gameConfig.scaleRange, 'FPS:', textStyle);
    }

    updateFps(time: number) {
        // Рассчитываем количество кадров в секунду
        this._time.fps = 1000 / (time - this._time.prev);
        this._time.prev = time;

        // Обновляем текст с количеством кадров в секунду
        this._time.fpsText.setText('FPS: ' + Math.round(this._time.fps));
    }
}