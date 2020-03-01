import Actor from './actor.js';

/**
 * Represents a monster.
 *
 * @export
 * @class Bat
 * @extends {Actor}
 */
export default class Bat extends Actor {
  /**
   * Creates an instance of Bat.
   *
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Bat
   */
  constructor(world, position) {
    super(world, position);
    this.turns = 1;
    this.char = 'ᨓ';
    this.name = 'bat';
    this.health = 3;
    this.damage = 1;
    this.speed = 2;
    this.world.scheduler.add(this, true);
  }
}
