import Scene from './scene.js';
import World from './world.js';

/**
 * Represents the scene that displays the ingame world.
 *
 * @export
 * @class WorldScene
 * @extends {Scene}
 */
export default class WorldScene extends Scene {
  /**
   * Starts the game.
   *
   * @memberof WorldScene
   */
  start() {
    super.start();
    this.selected = 0;
    this.music = new Audio('./music/.ogg');
    this.music.loop = true;
    this.music.play();
    this.world = new World(this);
    this.world.create();
    this.mouseX = -1;
    this.mouseY = -1;
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
    this.game.display.clear();
    if (this.world.hero.died) {
      this.switchTo(this.game.failScene);
      return;
    }
    this.world.hero.explored.forEach((position) => {
      const p = position.split(',');
      if (+p[2] === this.world.hero.z) {
        let char = this.world.map.get(position);
        let color = this.game.tiled ? 'rgba(71, 45, 60, 0.75)' : '#888';
        let bg = '#472d3c';
        if (+p[0] === this.mouseX &&
            +p[1] === this.mouseY &&
            this.world.hero.isPassable(+p[0], +p[1])) {
          bg = '#aaa';
        }
        if (this.world.hero.fov.has(`${p[0]},${p[1]}`)) {
          color = this.game.tiled ? 'transparent' : '#ccc';
          const actor = this.world.actors.find((actor) => actor.isAt(position));
          if (actor) {
            char = actor.char;
          }
          if (this.world.hero.isAt(position)) {
            char = '@';
          }
        }
        this.game.display.draw(+p[0], +p[1], char, color, bg);
      }
    });
    this.game.display.drawText(
        70, 24, `Music: ${this.music.muted ? 'off' : 'on'}`,
    );
    this.game.display.drawText(0, 24, `Level: ${this.world.hero.z}`);
    this.game.display.drawText(10, 24, `Health: ${this.world.hero.health}`);
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    const char = this.world.map.get(this.world.hero.position);
    if (event.type === 'mouseup') {
      this.world.hero.target = null;
    } else if (event.type === 'mousemove') {
      this.mouseX = this.eventX;
      this.mouseY = this.eventY;
      this.update();
      return;
    } else if (event.type === 'mousedown') {
      if (this.eventX > 69 && this.eventY === 24) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      }
      if (this.world.hero.isAtXY(this.eventX, this.eventY)) {
        if (char === '<') {
          this.world.hero.z -= 1;
          this.world.hero.x = this.world.downs[this.world.hero.z][0];
          this.world.hero.y = this.world.downs[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        } else if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        }
      }
      this.world.hero.target = [this.eventX, this.eventY];
      this.world.hero.moveToTargetAndUnlock();
    } else if (event.type === 'keydown') {
      let x = this.world.hero.x;
      let y = this.world.hero.y;
      if (event.keyCode === 77) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      } else if (event.keyCode === 13) {
        if (char === '<') {
          this.world.hero.z -= 1;
          this.world.hero.x = this.world.downs[this.world.hero.z][0];
          this.world.hero.y = this.world.downs[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        } else if (char === '>') {
          this.world.hero.z += 1;
          this.world.hero.x = this.world.ups[this.world.hero.z][0];
          this.world.hero.y = this.world.ups[this.world.hero.z][1];
          this.world.engine.unlock();
          return;
        }
      }
      if ([37, 65, 100].includes(event.keyCode)) {
        x -= 1;
      } else if ([38, 87, 104].includes(event.keyCode)) {
        y -= 1;
      } else if ([39, 68, 102].includes(event.keyCode)) {
        x += 1;
      } else if ([40, 83, 98].includes(event.keyCode)) {
        y += 1;
      } else if (event.keyCode === 103) {
        x -= 1;
        y -= 1;
      } else if (event.keyCode === 105) {
        x += 1;
        y -= 1;
      } else if (event.keyCode === 99) {
        x += 1;
        y += 1;
      } else if (event.keyCode === 97) {
        x -= 1;
        y += 1;
      }
      this.world.hero.target = [x, y];
      this.world.hero.moveToTargetAndUnlock();
    }
  }
}
