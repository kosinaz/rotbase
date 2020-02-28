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
      Move/attack with mouse/arrow/num/wasd keys.

      Move upstairs/downstairs with mouse/enter key.

      Mute/unmute the music with mouse/m key.
    `);
    this.game.display.drawText(1, 23, '>Back');
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
