import {Display} from '../lib/rot/index.js';
import MenuScene from './menuScene.js';
import WorldScene from './worldScene.js';
import HelpScene from './helpScene.js';
import CreditsScene from './creditsScene.js';
import WinScene from './winScene.js';
import FailScene from './failScene.js';

/**
 * Represent the game core object.
 *
 * @class Game
 */
export default class Game {

}
Game.tiled = true;
const tileset = document.createElement('img');
tileset.src = './images/1bitpack_kenney/Tilesheet/colored.png';
Game.display = new Display({
  bg: '#472d3c',
  layout: Game.tiled ? 'tile-gl' : 'rect',
  tileWidth: 16,
  tileHeight: 16,
  tileSet: tileset,
  tileMap: {
    ' ': [0, 0],
    '@': [459, 68],
    '§': [476, 136],
    'ᨓ': [442, 136],
    '#': [68, 102],
    '~': [136, 85],
    '♣': [68, 34],
    '̬ ': [102, 0],
    'ˬ': [85, 0],
    '˯': [119, 0],
    '‧': [68, 0],
    '+': [459, 391],
    '¬': [85, 527],
    '⊠': [204, 527],
    '>': [51, 102],
    '<': [34, 102],
    '➧': [408, 357],
    ':': [493, 493],
    '.': [510, 493],
    '.': [510, 493],
    '!': [323, 425],
    '0': [323, 493],
    '1': [340, 493],
    '2': [357, 493],
    '3': [374, 493],
    '4': [391, 493],
    '5': [408, 493],
    '6': [425, 493],
    '7': [442, 493],
    '8': [459, 493],
    '9': [476, 493],
    'a': [323, 510],
    'b': [340, 510],
    'c': [357, 510],
    'd': [374, 510],
    'e': [391, 510],
    'f': [408, 510],
    'g': [425, 510],
    'h': [442, 510],
    'i': [459, 510],
    'j': [476, 510],
    'k': [493, 510],
    'l': [510, 510],
    'm': [527, 510],
    'n': [323, 527],
    'o': [340, 527],
    'p': [357, 527],
    'q': [374, 527],
    'r': [391, 527],
    's': [408, 527],
    't': [425, 527],
    'u': [442, 527],
    'v': [459, 527],
    'w': [476, 527],
    'x': [493, 527],
    'y': [510, 527],
    'z': [527, 527],
    'A': [323, 510],
    'B': [340, 510],
    'C': [357, 510],
    'D': [374, 510],
    'E': [391, 510],
    'F': [408, 510],
    'G': [425, 510],
    'H': [442, 510],
    'I': [459, 510],
    'J': [476, 510],
    'K': [493, 510],
    'L': [510, 510],
    'M': [527, 510],
    'N': [323, 527],
    'O': [340, 527],
    'P': [357, 527],
    'Q': [374, 527],
    'R': [391, 527],
    'S': [408, 527],
    'T': [425, 527],
    'U': [442, 527],
    'V': [459, 527],
    'W': [476, 527],
    'X': [493, 527],
    'Y': [510, 527],
    'Z': [527, 527],
  },
  tileColorize: true,
  width: 80,
  height: 30,
  // forceSquareRatio: true,
  // fontFamily: 'font',
});
if (Game.tiled) {
  Game.display.drawText = function(x, y, text) {
    for (let i = 0; i < text.length; i += 1) {
      this.draw(x + i, y, text[i], 'transparent');
    };
  };
}
document.body.appendChild(Game.display.getContainer());
Game.worldScene = new WorldScene(Game);
Game.helpScene = new HelpScene(Game);
Game.creditsScene = new CreditsScene(Game);
Game.winScene = new WinScene(Game);
Game.failScene = new FailScene(Game);
Game.menuScene = new MenuScene(Game);
tileset.onload = function() {
  Game.menuScene.start();
};
