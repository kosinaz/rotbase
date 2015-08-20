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
  this.psc = new ROT.FOV.PreciseShadowcasting(this.isTransparent.bind(this));
  if (ROTBASE.player === undefined) {
    ROTBASE.player = new ROTBASE.Actor(this);
  } else {
    ROTBASE.player.init(this);
  }
  this.actors = [ROTBASE.player];
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
  this.engine.start();
  setTimeout(ROTBASE.draw, 100);
};

ROTBASE.Level.prototype.draw = function () {
  'use strict';
  this.drawExplored();
  this.drawFOV();
  this.drawStats();
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
  e = ROTBASE.player.explored;
  for (i in e) {
    if (e.hasOwnProperty(i)) {
      if (e[i].x === ROTBASE.mouseX && e[i].y === ROTBASE.mouseY) {
        this.bgcolor = '#444';
      } else {
        this.bgcolor = '#000';
      }
      ROTBASE.display.draw(e[i].x, e[i].y, e[i].char, '#888', this.bgcolor);
    }
  }
};

ROTBASE.Level.prototype.drawFOV = function () {
  'use strict';
  var i, f;
  f = ROTBASE.player.fov;
  for (i in f) {
    if (f.hasOwnProperty(i)) {
      if (f[i].x === ROTBASE.mouseX && f[i].y === ROTBASE.mouseY) {
        this.bgcolor = '#ccc';
      } else {
        this.bgcolor = '#000';
      }
      ROTBASE.display.draw(f[i].x, f[i].y, f[i].char, '#fff', this.bgcolor);
    }
  }
};

ROTBASE.Level.prototype.drawStats = function () {
  'use strict';
  ROTBASE.display.drawText(60, 0, 'Health: ' +
                           ROTBASE.player.currentHealth + '/' +
                           ROTBASE.player.maxHealth);
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
          this,
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
  if (ROTBASE.player.x === x && ROTBASE.player.y === y) {
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

ROTBASE.Level.prototype.isChar = function (x, y, char) {
  'use strict';
  return this.getChar(x, y) === char;
};

ROTBASE.Level.prototype.getTerrain = function (x, y) {
  'use strict';
  if (this.map.hasOwnProperty(x + ',' + y)) {
    return this.map[x + ',' + y].char;
  }
  return '#';
};

ROTBASE.Level.prototype.isTerrain = function (x, y, char) {
  'use strict';
  return this.getTerrain(x, y) === char;
};

ROTBASE.Level.prototype.setTerrain = function (x, y, char) {
  'use strict';
  this.map[x + ',' + y] = {
    x: x,
    y: y,
    char: char
  };
};
