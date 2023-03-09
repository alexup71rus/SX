import { Scene } from 'phaser'

export class PreloadScene extends Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.image('loc-home', '../assets/loc-home/home.png')
    this.load.image('collision-map', '../assets/loc-home/collision-map.png')
    this.load.image('player', '../assets/main-character/character.png')
  }

  create() {
    this.scene.start('GameScene', { isRestart: true })
  }
}