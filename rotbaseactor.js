/*global ROTBASE, ROT*/

ROTBASE.Actor = function (scheduler, char, x, y, range, speed, health) {
  'use strict';
  this.char = char || '@';
  this.x = x || 30;
  this.y = y || 10;
  this.range = range || 10;
  this.speed = speed || 10;
  this.currentHealth = this.maxHealth = health || 10;
  this.targetX = this.x;
  this.targetY = this.y;
  this.path = [];
  this.fov = {};
  this.explored = {};
  this.scheduler = scheduler;
  this.scheduler.add(this, true);
};

ROTBASE.Actor.prototype.setXY = function (xy) {
  'use strict';
  this.x = xy[0];
  this.y = xy[1];
};

ROTBASE.Actor.prototype.getSpeed = function () {
  'use strict';
  return this.speed;
};

ROTBASE.Actor.prototype.act = function () {
  'use strict';
  this.fov = {};
  ROTBASE.screen.level.fov.compute(
    this.x,
    this.y,
    this.range,
    this.updateFOV.bind(this)
  );
  if (this.char === '@') {
    ROTBASE.screen.level.engine.lock();
  } else {
    if (this.targetX !== this.x || this.targetY !== this.y) {
      this.path = [];
      new ROT.Path.AStar(
        this.targetX,
        this.targetY,
        ROTBASE.screen.level.isPassable.bind(ROTBASE.screen.level)
      ).compute(
        this.x,
        this.y,
        this.updatePath.bind(this)
      );
      this.setXY(this.path[1]);
    }
  }
};

ROTBASE.Actor.prototype.updatePath = function (x, y) {
  'use strict';
  this.path.push([x, y]);
};

ROTBASE.Actor.prototype.updateFOV = function (x, y) {
  'use strict';
  this.fov[x + ',' + y] = {
    x: x,
    y: y,
    char: ROTBASE.screen.level.getChar(x, y)
  };
  this.explored[x + ',' + y] = {
    x: x,
    y: y,
    char: ROTBASE.screen.level.getTerrain(x, y)
  };
  if (this.char !== '@' && this.fov[x + ',' + y].char === '@') {
    this.targetX = x;
    this.targetY = y;
  }
};

ROTBASE.Actor.prototype.exit = function () {
  'use strict';
  var x, y;
  this.x = 30;
  this.y = 10;
  this.explored = {};
  ROTBASE.screen.level = new ROTBASE.Level();
};
