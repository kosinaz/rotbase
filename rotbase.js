/*global ROT, console*/

var ROTBASE = {};

window.onload = function () {
  'use strict';
  console.log(new Date().getTime() + ' window loaded');
  ROTBASE.display = new ROT.Display({
    fontFamily: 'Courier'
  });
  document.body.appendChild(ROTBASE.display.getContainer());
  ROTBASE.log = '';
  ROTBASE.generateMonsterNames(ROTBASE.createLevel);
  window.addEventListener('click', ROTBASE.handleEvent);
  window.addEventListener('mousedown', ROTBASE.handleEvent);
  window.addEventListener('mouseup', ROTBASE.handleEvent);
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
  ROTBASE.display.draw(79, 0, '□');
  if (ROTBASE.level) {
    ROTBASE.level.draw();
  }
  if (ROTBASE.log) {
    ROTBASE.display.drawText(0, 20, ROTBASE.log);
  }
};

ROTBASE.handleEvent = function (e) {
  'use strict';
  var ePos, newx, newy;
  ePos = ROTBASE.display.eventToPosition(e);
  if (e.type === 'click') {
    if (ePos[0] === 79 && ePos[1] === 0) {
      ROTBASE.toggleFullscreen();
    }
  }
  if (e.type === 'mousedown') {
    ROTBASE.mouseDown = true;
    ROTBASE.level.player.target = {
      x: ePos[0],
      y: ePos[1]
    };
    ROTBASE.level.player.moveToTargetAndUnlock();
  }
  if (e.type === 'mouseup') {
    ROTBASE.mouseDown = false;
  }
  if (e.type === 'mousemove') {
    ROTBASE.mouseX = ePos[0];
    ROTBASE.mouseY = ePos[1];
    if (ROTBASE.mouseDown) {
      ROTBASE.level.player.target = {
        x: ePos[0],
        y: ePos[1]
      };
      ROTBASE.level.player.moveToTargetAndUnlock();
    }
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
    ROTBASE.level.player.moveToTargetAndUnlock();
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

ROTBASE.generateMonsterNames = function (callback) {
  'use strict';
  var request = new XMLHttpRequest();
  request.open("get", 'namesamples.txt', true);
  request.send();
  request.onreadystatechange = function () {
    var samples, names, generator, i, name;
    if (request.readyState === 4) {
      console.log(new Date().getTime() + ' name samples loaded');
      ROTBASE.monsterNames = [];
      ROTBASE.itemNames = [];
      samples = request.responseText;
      names = samples.split('\n');
      generator = new ROT.StringGenerator();
      for (i = 0; i < names.length; i += 1) {
        generator.observe(names[i]);
      }
      for (i = 0; i < 26; i += 1) {
        do {
          name = generator.generate();
        } while (name.length < 3 ||
                 name.length > 9 ||
                 samples.search(name + '\n') !== -1 ||
                 name.charAt(0) !== String.fromCharCode(97 + i));
        ROTBASE.monsterNames.push(name.capitalize().trim());
      }
      for (i = 0; i < 26; i += 1) {
        do {
          name = generator.generate();
        } while (name.length < 3 ||
                 name.length > 9 ||
                 samples.search(name + '\n') !== -1 ||
                 name.charAt(0) !== String.fromCharCode(97 + i));
        ROTBASE.itemNames.push(name.trim());
      }
      console.log(new Date().getTime() + ' names generated');
      console.log(ROTBASE.monsterNames, ROTBASE.itemNames);
      callback();
    }
  };
};

ROTBASE.createLevel = function () {
  'use strict';
  ROTBASE.level = new ROTBASE.Level();
};
