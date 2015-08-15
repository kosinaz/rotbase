/*global ROTBASE*/

ROTBASE.Button = function (x, y, char) {
  'use strict';
  this.x = x;
  this.y = y;
  this.char = char;
  this.color = '#fff';
  this.bgcolor = '#000';
};

ROTBASE.Button.prototype.update = function () {
  'use strict';
  if (ROTBASE.mouse.x === this.x &&
      ROTBASE.mouse.y === this.y) {
    this.bgcolor = '#444';
  } else {
    this.bgcolor = '#000';
  }
};

ROTBASE.Button.prototype.draw = function () {
  'use strict';
  ROTBASE.display.draw(this.x, this.y, this.char, this.color, this.bgcolor);
};
