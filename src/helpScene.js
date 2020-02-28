import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class HelpScene
 * @extends {Scene}
 */
export default class HelpScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof HelpScene
   */
  start() {
    super.start();
    this.game.display.drawText(38, 1, 'Help');
    this.game.display.drawText(2, 3, `
      Move or attack with mouse or arrow or num or wasd keys

      Move upstairs or downstairs with mouse or enter key

      Mute or unmute the music with mouse or m key
    `);
    this.game.display.drawText(1, 23, '}Back');
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 13) {
        this.switchTo(this.game.menuScene);
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX > 1 && this.eventX < 6 && this.eventY === 23) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
