import { Game, Types, AUTO } from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { GameScene } from './scenes/GameScene'
import gameConfig from './gameConfig'

declare global {
  interface Window {
    api?: any;
  }
}

const config: Types.Core.GameConfig = {
  type: AUTO,
  pixelArt: true,
  width: gameConfig.screenWidth,
  height: gameConfig.screenHeight,
  backgroundColor: gameConfig.backgroundColor,
  physics: gameConfig.physics,
  scene: [
    PreloadScene,
    GameScene
  ],
}

window.api = new Game(config)