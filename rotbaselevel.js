/*global ROTBASE, ROT*/

ROTBASE.Level = function (x, y, width, height) {
  'use strict';
  var i;
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 60;
  this.height = height || 20;
  this.scheduler = new ROT.Scheduler.Speed();
  this.engine = new ROT.Engine(this.scheduler);
  this.map = {};
  this.player = new ROTBASE.Actor(this.scheduler);
  this.actors = [this.player];
  this.digger = new ROT.Map.Digger(this.width, this.height);
  this.digger.create(this.initMap.bind(this));
  this.rooms = this.digger.getRooms();
  this.exit = this.rooms[this.rooms.length - 1].getCenter();
  this.map[this.exit[0] + ',' + this.exit[1]] = {
    x: this.exit[0],
    y: this.exit[1],
    char: '>'
  };
  for (i = 0; i < this.rooms.length; i += 1) {
    this.rooms[i].getDoors(this.initDoor.bind(this));
  }
  this.fov = new ROT.FOV.PreciseShadowcasting(this.isTransparent.bind(this));
};

ROTBASE.Level.prototype.update = function () {
  'use strict';

};

ROTBASE.Level.prototype.draw = function () {
  'use strict';
  this.drawExplored();
  this.drawFOV();
};

ROTBASE.Level.prototype.drawWhole = function () {
  'use strict';
  var x, y;
  for (x = 0; x < this.width; x += 1) {
    for (y = 0; y < this.height; y += 1) {
      ROTBASE.display.draw(this.x + x, this.y + y, this.getChar(x, y));
    }
  }
};

ROTBASE.Level.prototype.drawExplored = function () {
  'use strict';
  var i, e;
  e = this.player.explored;
  for (i in e) {
    if (e.hasOwnProperty(i)) {
      ROTBASE.display.draw(e[i].x, e[i].y, e[i].char, '#555');
    }
  }
};

ROTBASE.Level.prototype.drawFOV = function () {
  'use strict';
  var i, f;
  f = this.player.fov;
  for (i in f) {
    if (f.hasOwnProperty(i)) {
      ROTBASE.display.draw(f[i].x, f[i].y, f[i].char);
    }
  }
};

ROTBASE.Level.prototype.initMap = function (x, y, value) {
  'use strict';
  if (!value) {
    this.map[x + ',' + y] = {
      x: x,
      y: y,
      char: '.'
    };
    if (ROT.RNG.getPercentage() === 1) {
      this.actors.push(
        new ROTBASE.Actor(
          this.scheduler,
          String.fromCharCode(this.actors.length + 64),
          x,
          y,
          10,
          6,
          6
        )
      );
    }
  }
};

ROTBASE.Level.prototype.initDoor = function (x, y) {
  'use strict';
  this.map[x + ',' + y].char = '+';
};

ROTBASE.Level.prototype.isTransparent = function (x, y) {
  'use strict';
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char !== '+';
  }
  return false;
};

ROTBASE.Level.prototype.isPassable = function (x, y) {
  'use strict';
  return this.map.hasOwnProperty(x + ',' + y);
};

ROTBASE.Level.prototype.getChar = function (x, y) {
  'use strict';
  var i;
  if (this.player.x === x && this.player.y === y) {
    return '@';
  }
  for (i = 0; i < this.actors.length; i += 1) {
    if (this.actors[i].x === x && this.actors[i].y === y) {
      return this.actors[i].char;
    }
  }
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char;
  }
  return '#';
};

ROTBASE.Level.prototype.getTerrain = function (x, y) {
  'use strict';
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char;
  }
  return '#';
};

ROTBASE.Level.prototype.setChar = function (x, y, char) {
  'use strict';
  this.map[x + ',' + y] = {
    x: x,
    y: y,
    char: char
  };
};
