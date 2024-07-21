import { Scene } from 'phaser';
import gameConfig from "../gameConfig";
import Map = Phaser.Structs.Map;
import FPS from "../FPS/FPS";
import PlayerController from "../Player/PlayerController";

type SceneCreateProps = {
  isRestart?: boolean,
  isSceneStarted?: boolean,
}

const sceneName = 'GameScene';

export class GameScene extends Scene {
  readonly gameWidth: number = gameConfig.screenWidth;
  readonly gameHeight: number = gameConfig.screenHeight - (160 * gameConfig.scaleRange);
  readonly inputBarHeight: number = gameConfig.screenHeight - (gameConfig.screenHeight - (160 * gameConfig.scaleRange));

  public graphics: Phaser.GameObjects.Graphics;
  public gameSceneShape: Phaser.GameObjects.Graphics;
  public backgroundSprite: Phaser.GameObjects.Image;
  public collectGameObjects: Map<any, any>;
  public uiContainer: Phaser.GameObjects.Container;
  public _isSceneStarted: boolean = false;

  constructor() {
    super(sceneName);
  }

  async onRestartGame() {
    this.scene.restart({ isRestart: true });
  }

  public create({ isRestart }: SceneCreateProps) {
    this.graphics = this.add.graphics();
    this.uiContainer = this.add.container(0, 0);
    this.uiContainer.setDepth(1000);

    this.drawScene();
    this.initControllers();
    this.startControllers();
    this.bindEvents();
    this.resizeGameWindow();

    this._isSceneStarted = true;
  }

  public resizeGameWindow() {
    this.children.list.forEach((child: any) => {
      if (typeof child.setScale === 'function') {
        child.setScale(gameConfig.scaleRange);
      }
    });
  }

  private drawScene() {
    this.gameSceneShape = this.make.graphics({});
    this.backgroundSprite = this.add.image((this.gameWidth / 2), this.gameHeight / 2, 'scene1');

    this.gameSceneShape.fillStyle(0x000000);
    this.gameSceneShape.fillRoundedRect(
      0,
      (-40 * gameConfig.scaleRange),
      this.gameWidth,
      this.gameHeight + (40 * gameConfig.scaleRange),
      (40 * gameConfig.scaleRange)
    );

    this.backgroundSprite.setMask(this.gameSceneShape.createGeometryMask());
  }

  created = false;

  private startControllers() {

    const fps = this.collectGameObjects.get('fps');
    const player = this.collectGameObjects.get('player');

    if (fps) {
      fps.showFps();
      const fpsText = fps.getGraphicsObject();
      if (fpsText) {
        this.uiContainer.add(fpsText);
      }
    }

    if (player) {
      player.create();

      // player.bottomPanelButtons.forEach((btn: any, key: any) => {
      //   btn.setPosition(, this.inputBarHeight - btn.height);
      //   this.uiContainer.add(btn);
      // });
    }
  }

  private initControllers() {
    this.collectGameObjects = new Map([]);
    const fps = new FPS(this);
    this.collectGameObjects.set('fps', fps);
    this.collectGameObjects.set('player', new PlayerController(this));
  }

  private bindEvents() {}

  public update(time: number, delta: number) {
    super.update(time, delta);

    if (this._isSceneStarted) {
      const fps = this.collectGameObjects.get('fps');
      const player = this.collectGameObjects.get('player');

      if (fps) {
        fps.updateFps(time);
      }

      if (player) {
        player.update(time, delta);
        this.cameras.main.startFollow(player.getPlayerPosition(), true, 0.1, 0.1);
      }

      this.uiContainer.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
    }
  }
}
