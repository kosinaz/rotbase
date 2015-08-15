/*global ROT*/

var ROTBASE = {};

window.onload = function () {
  'use strict';
  ROTBASE.display = new ROT.Display({
    fontFamily: 'Courier'
  });
  document.body.appendChild(ROTBASE.display.getContainer());
  ROTBASE.screen = { //a list of things to display on screen and interact with
    fullscreenButton: new ROTBASE.Button(79, 0, '□'),
    level: new ROTBASE.Level()
  };
  setInterval(function () {
    ROTBASE.draw();
    ROTBASE.update();
  }, 10);
  ROTBASE.mouse = {
    x: 0,
    y: 0,
    down: {},
    up: {},
    click: {}
  };
  ROTBASE.newmouse = ROTBASE.mouse;
  window.addEventListener('mousedown', ROTBASE.handleEvent);
  window.addEventListener('mouseup', ROTBASE.handleEvent);
  window.addEventListener('mousemove', ROTBASE.handleEvent);
  window.addEventListener('keydown', ROTBASE.handleEvent);
};

ROTBASE.update = function () {
  'use strict';
  var i, fontSize;
  ROTBASE.mouse = {
    x: ROTBASE.newmouse.x,
    y: ROTBASE.newmouse.y,
    down: {
      x: ROTBASE.newmouse.down.x,
      y: ROTBASE.newmouse.down.y
    },
    up: {
      x: ROTBASE.newmouse.up.x,
      y: ROTBASE.newmouse.up.y
    },
    click: {
      x: ROTBASE.newmouse.click.x,
      y: ROTBASE.newmouse.click.y
    }
  };
  for (i in ROTBASE.screen) {
    if (ROTBASE.screen.hasOwnProperty(i)) {
      ROTBASE.screen[i].update();
    }
  }
  fontSize = ROTBASE.display.computeFontSize(
    window.innerWidth,
    window.innerHeight
  );
  if (ROTBASE.display.getOptions().fontSize !== fontSize) {
    ROTBASE.display.setOptions({
      fontSize: fontSize
    });
  }
  ROTBASE.newmouse.click = {};
  ROTBASE.newmouse.up = {};
};

ROTBASE.draw = function () {
  'use strict';
  var i;
  ROTBASE.display.clear();
  for (i in ROTBASE.screen) {
    if (ROTBASE.screen.hasOwnProperty(i)) {
      ROTBASE.screen[i].draw();
    }
  }
};


ROTBASE.handleEvent = function (e) {
  'use strict';
  var ePos, newx, newy;
  ePos = ROTBASE.display.eventToPosition(e);
  if (e.type === 'mousedown') {
    ROTBASE.newmouse.down = {
      x: ePos[0],
      y: ePos[1]
    };
  }
  if (e.type === 'mouseup') {
    ROTBASE.newmouse.up = {
      x: ePos[0],
      y: ePos[1]
    };
    if (ROTBASE.newmouse.up.x === ROTBASE.newmouse.down.x &&
        ROTBASE.newmouse.up.y === ROTBASE.newmouse.down.y) {
      ROTBASE.newmouse.click = {
        x: ePos[0],
        y: ePos[1]
      };
      if (ROTBASE.newmouse.click.x === ROTBASE.screen.fullscreenButton.x &&
          ROTBASE.newmouse.click.y === ROTBASE.screen.fullscreenButton.y) {
        ROTBASE.toggleFullscreen();
      }
    }
    ROTBASE.newmouse.down = {};
  }
  if (e.type === 'mousemove') {
    ROTBASE.newmouse.x = ePos[0];
    ROTBASE.newmouse.y = ePos[1];
  }
  if (e.type === 'keydown') {
    newx = 0;
    newy = 0;
    switch (e.keyCode) {
    case 35:
    case 97:
      newx -= 1;
      newy += 1;
      break;
    case 40:
    case 83:
    case 98:
      newy += 1;
      break;
    case 34:
    case 99:
      newx += 1;
      newy += 1;
      break;
    case 37:
    case 65:
    case 100:
      newx -= 1;
      break;
    case 13:
      if (ROTBASE.screen.level.getTerrain(
          ROTBASE.screen.level.player.x,
          ROTBASE.screen.level.player.y
        ) === '>') {
        ROTBASE.screen.level.player.exit();
        ROTBASE.screen.level.engine.unlock();
      }
      return;
    case 39:
    case 68:
    case 102:
      newx += 1;
      break;
    case 36:
    case 103:
      newx -= 1;
      newy -= 1;
      break;
    case 38:
    case 87:
    case 104:
      newy -= 1;
      break;
    case 33:
    case 105:
      newx += 1;
      newy -= 1;
      break;
    }
    if (ROTBASE.screen.level.getChar(
        (ROTBASE.screen.level.player.x + newx),
        (ROTBASE.screen.level.player.y + newy)
      ) !== '#') {
      if (ROTBASE.screen.level.getChar(
          ROTBASE.screen.level.player.x + newx,
          ROTBASE.screen.level.player.y + newy
        ) === '+') {
        ROTBASE.screen.level.setChar(
          ROTBASE.screen.level.player.x + newx,
          ROTBASE.screen.level.player.y + newy,
          '/'
        );
      }
      ROTBASE.screen.level.player.setXY([
        ROTBASE.screen.level.player.x + newx,
        ROTBASE.screen.level.player.y + newy
      ]);
      ROTBASE.screen.level.engine.unlock();
    }
  }
};

ROTBASE.toggleFullscreen = function () {
  'use strict';
  var canvas = ROTBASE.display.getContainer();
  if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen(canvas.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};
