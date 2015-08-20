/*global ROTBASE, ROT*/

ROTBASE.Actor = function (level, char, x, y, range, speed, health) {
  'use strict';
  this.char = char || '@';
  this.x = x || 30;
  this.y = y || 10;
  this.range = range || 10;
  this.speed = speed || 10;
  this.currentHealth = this.maxHealth = health || 10;
  this.target = {};
  this.path = [];
  this.fov = {};
  this.explored = {};
  this.level = level;
  this.scheduler = level.scheduler;
  this.scheduler.add(this, true);
  this.psc = level.psc;
};

ROTBASE.Actor.prototype.setXY = function (xy) {
  'use strict';
  if (xy) {
    this.x = xy[0];
    this.y = xy[1];
  }
  if (ROTBASE.level.isTerrain(this.x, this.y, '+')) {
    ROTBASE.level.setTerrain(this.x, this.y, '/');
  }
};

ROTBASE.Actor.prototype.getSpeed = function () {
  'use strict';
  return this.speed;
};

ROTBASE.Actor.prototype.act = function () {
  'use strict';
  this.fov = {};
  this.psc.compute(
    this.x,
    this.y,
    this.range,
    this.updateFOV.bind(this)
  );
  if (this.char === '@') {
    ROTBASE.draw();
    this.level.engine.lock();
    if (this.target) {
      setTimeout(this.moveToTargetAndUnlock.bind(this), 100);
    }
  } else {
    this.moveToTarget.bind(this);
  }
};

ROTBASE.Actor.prototype.moveToTargetAndUnlock = function () {
  "use strict";
  if (this.moveToTarget()) {
    ROTBASE.level.engine.unlock();
  }
};

ROTBASE.Actor.prototype.moveToTarget = function () {
  "use strict";
  if (!this.target || !this.level.isPassable(this.target.x, this.target.y)) {
    return false;
  }
  this.path = [];
  new ROT.Path.AStar(
    this.target.x,
    this.target.y,
    this.level.isPassable.bind(this.level)
  ).compute(
    this.x,
    this.y,
    this.updatePath.bind(this)
  );
  this.setXY(this.path[1]);
  return true;
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
    char: this.level.getChar(x, y)
  };
  this.explored[x + ',' + y] = {
    x: x,
    y: y,
    char: this.level.getTerrain(x, y)
  };
  if (this.char !== '@' && this.fov[x + ',' + y].char === '@') {
    this.targetX = x;
    this.targetY = y;
  }
};
