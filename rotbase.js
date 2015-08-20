/*global ROT*/

var ROTBASE = {};

window.onload = function () {
  'use strict';
  ROTBASE.display = new ROT.Display({
    fontFamily: 'Courier'
  });
  document.body.appendChild(ROTBASE.display.getContainer());
  ROTBASE.level = new ROTBASE.Level();
  window.addEventListener('mousedown', ROTBASE.handleEvent);
  window.addEventListener('click', ROTBASE.handleEvent);
  window.addEventListener('mousemove', ROTBASE.handleEvent);
  window.addEventListener('keydown', ROTBASE.handleEvent);
  setInterval(function () {
    ROTBASE.display.setOptions({
      fontSize: ROTBASE.display.computeFontSize(
        window.innerWidth,
        window.innerHeight
      )
    });
  }, 100);
};

ROTBASE.draw = function () {
  'use strict';
  ROTBASE.display.clear();
  if (ROTBASE.level) {
    ROTBASE.level.draw();
  }
  ROTBASE.display.draw(79, 0, '□');
};


ROTBASE.handleEvent = function (e) {
  'use strict';
  var ePos, newx, newy;
  ePos = ROTBASE.display.eventToPosition(e);
  if (e.type === 'mousedown') {
    ROTBASE.level.player.target = {
      x: ePos[0],
      y: ePos[1]
    };
  }
  if (e.type === 'click') {
    if (ePos[0] === 79 && ePos[1] === 0) {
      ROTBASE.toggleFullscreen();
    }
  }
  if (e.type === 'mousemove') {
    ROTBASE.mouseX = ePos[0];
    ROTBASE.mouseY = ePos[1];
    ROTBASE.draw();
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
      if (ROTBASE.level.getTerrain(
          ROTBASE.level.player.x,
          ROTBASE.level.player.y
        ) === '>') {
        ROTBASE.level = new ROTBASE.Level();
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
    ROTBASE.level.player.target = {
      x: ROTBASE.level.player.x + newx,
      y: ROTBASE.level.player.y + newy
    };
  }
  ROTBASE.level.player.moveToTargetAndUnlock();
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
