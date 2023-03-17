import { Scene } from 'phaser'

export class PreloadScene extends Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.svg('btn-attack', '../assets/inteface/bottom-panel/buttons/attack.svg')
    this.load.svg('btn-block', '../assets/inteface/bottom-panel/buttons/block.svg')
    this.load.svg('btn-jump', '../assets/inteface/bottom-panel/buttons/jump.svg')
    this.load.svg('btn-kunai', '../assets/inteface/bottom-panel/buttons/kunai.svg')
    this.load.svg('joystick-bg', '../assets/inteface/bottom-panel/joystick/bg.svg')
    this.load.svg('joystick-stick', '../assets/inteface/bottom-panel/joystick/stick.svg')

    // scene
    this.load.svg('scene1', '../assets/loc-start/bg.svg')

    // player
    this.load.spritesheet('player', '../assets/main-character/main.svg', {
      frameWidth: 200,
      frameHeight: 200,
      startFrame: 0
    })
  }

  create() {
    this.scene.start('GameScene', { isRestart: true })
  }
}