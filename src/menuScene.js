import Scene from './scene.js';

/**
 * Represents the scene that displays the menu.
 *
 * @export
 * @class MenuScene
 * @extends {Scene}
 */
export default class MenuScene extends Scene {
  /**
   * Opens the menu scene.
   *
   * @memberof MenuScene
   */
  start() {
    super.start();
    this.selected = 0;
    this.game.display.drawText(36, 1, 'ROTBASE');
    this.game.display.drawText(1, 4, '➧Start');
    this.game.display.drawText(2, 6, 'Help');
    this.game.display.drawText(2, 8, 'Credits');
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof MenuScene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 40 && this.selected < 2) {
        this.game.display.draw(
            1, 4 + this.selected * 2, ' ', this.game.tiled ? 'transparent' : '',
        );
        this.selected += 1;
        this.game.display.draw(
            1, 4 + this.selected * 2, '➧', this.game.tiled ? 'transparent' : '',
        );
      } else if (event.keyCode === 38 && this.selected > 0) {
        this.game.display.draw(
            1, 4 + this.selected * 2, ' ', this.game.tiled ? 'transparent' : '',
        );
        this.selected -= 1;
        this.game.display.draw(
            1, 4 + this.selected * 2, '➧', this.game.tiled ? 'transparent' : '',
        );
      } else if (event.keyCode === 13) {
        if (this.selected === 0) {
          this.switchTo(this.game.worldScene);
        } else if (this.selected === 1) {
          this.switchTo(this.game.helpScene);
        } else if (this.selected === 2) {
          this.switchTo(this.game.creditsScene);
        }
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX > 1) {
        if (this.eventX < 7 && this.eventY === 4) {
          this.switchTo(this.game.worldScene);
        } else if (this.eventX < 6 && this.eventY === 6) {
          this.switchTo(this.game.helpScene);
        } else if (this.eventX < 9 && this.eventY === 8) {
          this.switchTo(this.game.creditsScene);
        }
      }
    }
  }
}
