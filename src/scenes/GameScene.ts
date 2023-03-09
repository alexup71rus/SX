import { Scene } from 'phaser'

type SceneCreateProps = {
  isRestart?: boolean
}

export class GameScene extends Scene {
  // размер холста
  private gameWidth: number;
  private gameHeight: number;

  private backgroundSprite: any;
  private playerSprite: any;

  private collisionLayer: any;

  private keyPressed: string;

  private _isGameOver: boolean

  setCollisionMap = () => {
    const groundMap = [
      0, 0,
      54 * 3, 0,
      120 * 3, 40 * 3,
      1240 * 3, 40 * 3,
      1240 * 3, 80 * 3,
      0, 80 * 3,
    ];
    const groundPath = groundMap.join();

    this.collisionLayer = this.add.polygon(583 * 3, this.gameHeight - 60 * 3, groundPath, 0xffffff, 0)
    this.collisionLayer.setOrigin(0, 0)
    this.collisionLayer = this.matter.add.gameObject(this.collisionLayer,
        {
          shape: {
            type: 'fromVerts', verts: groundPath, flagInternal: true
          }
        })
    this.collisionLayer.setStatic(true)
  }

  onStartGame = async () => {
    this.gameWidth = 1366 * 3;
    this.gameHeight = 768 * 3;

    this.matter.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);

    this.backgroundSprite = this.add.image(0, 0, 'loc-home')
    this.backgroundSprite.setOrigin(0, 0);
    this.backgroundSprite.setScale(3);
    // this.backgroundSprite = this.add.image(0, this.gameHeight - 117, 'collision-map')
    // this.backgroundSprite.setOrigin(0, 0);

    this.setCollisionMap();

    this.playerSprite = this.matter.add.sprite(100, 300, 'player');
    this.playerSprite.setScale(3);
    this.playerSprite.setBounce(.4);
  }

  onRestartGame = () => {
    this.scene.restart({ isRestart: true })
  }

  constructor() {
    super('GameScene')
  }

  async create({ isRestart }: SceneCreateProps) {
    this._isGameOver = false

    this.onStartGame();

    this.initEvents()
  }



  initEvents() {
    window.addEventListener('keydown', ev => {
      this.keyPressed = ev.code
    })

    window.addEventListener('keyup', ev => {
      this.keyPressed = ''
    })
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.cameras.main.startFollow(this.playerSprite, false, 10, 10);

    if (this.keyPressed === 'ArrowRight') {
      this.playerSprite.setVelocityX(2);
    } else if (this.keyPressed === 'ArrowLeft') {
      this.playerSprite.setVelocityX(-2);
    } else if (this.keyPressed === 'Space') {
      this.playerSprite.setVelocityY(-2);
    }

    this.playerSprite.setAngle(0)
  }
}