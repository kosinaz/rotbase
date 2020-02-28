import Simple from '../lib/rot/scheduler/simple.js';
import {Engine, RNG} from '../lib/rot/index.js';
import Hero from './hero.js';
import Arena from '../lib/rot/map/arena.js';
import Digger from '../lib/rot/map/digger.js';

/**
 * Represent the ingame world.
 *
 * @export
 * @class World
 */
export default class World {
  /**
   * Creates an instance of World.
   *
   * @param {Scene} scene
   * @memberof World
   */
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Creates the content of the world.
   *
   * @memberof World
   */
  create() {
    this.scheduler = new Simple();
    this.engine = new Engine(this.scheduler);
    this.map = new Map();
    this.ups = [[]];
    this.downs = [[60, 12]];
    this.actors = [];
    const arena = new Arena(80, 24);
    arena.create((x, y, value) => {
      if (value) {
        this.map.set(`${x},${y},0`, '~');
      } else if (!RNG.getUniformInt(0, 5)) {
        if (x === 1 || x === 78 || y === 1 || y === 22) {
          this.map.set(`${x},${y},0`, '~');
        } else {
          this.map.set(`${x},${y},0`, '^');
        }
      } else {
        this.map.set(`${x},${y},0`, ',');
      }
    });
    const digger = new Digger(80, 24);
    for (let z = 1; z < 10; z += 1) {
      digger.create((x, y, value) => {
        if (value) {
          this.map.set(`${x},${y},${z}`, '#');
        } else {
          this.map.set(`${x},${y},${z}`, '.');
        }
      });
      const rooms = digger.getRooms();
      this.ups[z] = rooms[0].getCenter();
      this.downs[z] = rooms[rooms.length - 1].getCenter();
      this.map.set(`${this.ups[z][0]},${this.ups[z][1]},${z}`, '<');
      this.map.set(`${this.downs[z][0]},${this.downs[z][1]},${z}`, '>');
    }
    this.hero = new Hero(this, `20,12,0`);
    this.map.set(`20,12,0`, ',');
    this.map.set(`${this.downs[0][0]},${this.downs[0][1]},0`, '>');
    this.engine.start();
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof World
   */
  update() {
    this.scene.update();
  }
}
