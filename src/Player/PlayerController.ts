import { GameObjects, Scene } from "phaser";
import gameConfig from "../gameConfig";
import { GameScene } from "../scenes/GameScene";
import PlayerSprite from "./PlayerSprite";
import Keyboard from "./Keyboard";
import Joystick from "./Joystick";

export default class PlayerController {
  private playerSprite: PlayerSprite;
  private readonly _bottomPanelMargin: number = 30;
  private readonly joystickVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private readonly speed: number = 60 * gameConfig.scaleRange;
  private joystick: Joystick;
  private keyboard: Keyboard;
  private bottomPanelButtons: Map<string, GameObjects.Sprite> = new Map<string, GameObjects.Sprite>();
  private buttonDelays: Map<string, number> = new Map<string, number>();
  private buttonsPressed: Map<string, boolean> = new Map<string, boolean>();
  private buttonCooldowns: Map<string, boolean> = new Map<string, boolean>();

  constructor(private readonly _scene: GameScene) {}

  private createButton(name: string, x: number, y: number, texture: string, delay: number, interactive: boolean = true): void {
    const button = this._scene.add.sprite(x, y, texture);
    if (interactive) button.setInteractive();
    this.bottomPanelButtons.set(name, button);
    this.setButtonDelay(name, delay);
  }

  renderBottomPanel() {
    // Создание кнопок на нижней панели
    this.createButton('attack', this._scene.gameWidth - 57 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 38) * gameConfig.scaleRange, 'btn-attack', 300);
    this.createButton('jump', this._scene.gameWidth - 57 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 84) * gameConfig.scaleRange, 'btn-jump', 600);
    this.createButton('block', this._scene.gameWidth - 152 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 38) * gameConfig.scaleRange, 'btn-block', 150);
    this.createButton('kunai', this._scene.gameWidth - 152 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 88) * gameConfig.scaleRange, 'btn-kunai', 100);
    this.createButton('joystick-place', 82 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 63) * gameConfig.scaleRange, 'joystick-bg', 0, false);
    this.createButton('joystick-point', 82 * gameConfig.scaleRange, this._scene.gameHeight + this._scene.inputBarHeight - (this._bottomPanelMargin + 63) * gameConfig.scaleRange, 'joystick-stick', 0);
  }

  createGameController() {
    this.renderBottomPanel();
    this._scene.input.addPointer(2);
    this._scene.input.setDraggable(this.bottomPanelButtons.get('joystick-point')!);

    // Добавление взаимодействия для кнопок
    const buttonActions = ['attack', 'jump', 'block', 'kunai'];
    buttonActions.forEach(action => {
      const button = this.bottomPanelButtons.get(action);
      if (button) {
        button.on("pointerdown", () => this.playerAction(action, "down"));
        button.on("pointerup", () => this.playerAction(action, "up"));
      }
    });
  }

  async spawnPlayer(x: number, y: number) {
    this.keyboard = new Keyboard(this._scene);
    this.joystick = new Joystick(this._scene);
    this.playerSprite = new PlayerSprite(this._scene, { x, y });
    this.playerSprite.start();
    this.playerSprite.setMask(this._scene.gameSceneShape.createGeometryMask());
    this.initEvents();
  }

  setButtonDelay(name: string, delay: number) {
    this.buttonDelays.set(name, delay);
  }

  initEvents() {
    this.keyboard.handlerKeyboardMove(this.joystickVelocity);

    const joystickPoint = this.bottomPanelButtons.get("joystick-point");
    if (joystickPoint) {
      this.joystick.handlerJoystick(joystickPoint, this.joystickVelocity);
    }

    // Добавление событий клавиатуры для способностей
    const abilities = ["attack", "jump", "block", "kunai"];
    const keysForAbilities = ["RIGHT", "UP", "DOWN", "LEFT"];
    const keyboard = this._scene.input.keyboard;

    if (keyboard) {
      abilities.forEach((ability, index) => {
        const key = keysForAbilities[index];
        keyboard.on(`keydown-${key}`, () => this.playerAction(ability, "down"));
        keyboard.on(`keyup-${key}`, () => this.playerAction(ability, "up"));
      });

      // Добавление клавиш для движения
      const movementKeys = ["W", "A", "S", "D"];
      movementKeys.forEach(key => {
        keyboard.on(`keydown-${key}`, () => this.playerAction(key, "down"));
        keyboard.on(`keyup-${key}`, () => this.playerAction(key, "up"));
      });
    }
  }

  playerMove(time: number, delta: number) {
    let playerSpeedDelta = this.speed * (delta / 1000);
    let speedX: number = 0;
    let speedY: number = 0;

    if (this.joystickVelocity.x !== 0) {
      speedX = this.joystickVelocity.x > 0 ? playerSpeedDelta : -playerSpeedDelta;
    }

    if (this.joystickVelocity.y !== 0) {
      speedY = this.joystickVelocity.y > 0 ? playerSpeedDelta : -playerSpeedDelta;
    }

    this.playerSprite.move(speedX, speedY);
  }

  async create() {
    this.createGameController();
    await this.spawnPlayer(this._scene.gameWidth / 2, this._scene.gameHeight / 2);
  }

  update(time: number, delta: number) {
    this.playerMove(time, delta);
  }

  tweenButton(btnKey: string, action: Function): boolean {
    const btn = this.bottomPanelButtons.get(btnKey);
    if (!btn) return false;

    const delay = this.buttonDelays.get(btnKey) || 0;

    if (this.buttonCooldowns.get(btnKey)) {
      return false;
    }

    this.buttonCooldowns.set(btnKey, true);

    this._scene.tweens.add({
      targets: btn,
      scale: (1 + 0.15) * gameConfig.scaleRange,
      duration: delay,
      ease: "Power1",
      yoyo: true,
      onComplete: () => {
        setTimeout(() => {
          this.buttonCooldowns.set(btnKey, false);
        }, delay);
      }
    });

    action();

    return true;
  }

  playerAction(code: string, act?: string) {
    if (act === "down") {
      const action = this.getPlayerAction(code);

      if (this.buttonCooldowns.get(action.name)) {
        return;
      }

      this.tweenButton(action.name, () => {
        if (action.name === "attack" || action.name === "block") {
          action.action(1);
        } else {
          action.action();
        }
      });
    } else if (act === "up") {
      this.buttonsPressed.set(code, false);
    }
  }

  getPlayerAction(inputCode: string): { name: string, action: (arg?: number) => void } {
    let action = {
      name: inputCode,
      action: (arg?: number) => {
        console.log(`Action executed: ${inputCode} with arg ${arg}`);
      }
    };

    switch (inputCode) {
      case "jump":
      case "UP":
      case "ArrowUp":
        action = {
          name: 'jump',
          action: (i) => console.log('Jump action executed', i)
        };
        break;

      case "block":
      case "DOWN":
      case "ArrowDown":
        action = {
          name: 'block',
          action: (i) => console.log('Block action executed', i)
        };
        break;

      case "kunai":
      case "LEFT":
      case "ArrowLeft":
        action = {
          name: 'kunai',
          action: (i) => console.log('Kunai action executed', i)
        };
        break;

      case "attack":
      case "RIGHT":
      case "ArrowRight":
        action = {
          name: 'attack',
          action: (i) => console.log('Attack action executed', i)
        };
        break;
    }

    return action;
  }

  // Возвращает текущую позицию игрока
  getPlayerPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.playerSprite.x, this.playerSprite.y);
  }
}
