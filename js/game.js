import { INITIAL_LEVEL, SLOT_COSTS_LIST } from './constants.js';
import { Peg } from './peg.js';
import { Slot } from './slot.js';
import { Play } from './play.js';

let pegs = [];
let fraction;
let slots = [];
let openning;
let bet = 1.0;
let points = 100;
let topBounce = 0.5;
let sideBounce = 3;
let incrWeightValue = 0;
let music;

window.onload = function () {
  let app = new PIXI.Application({
    height: 1500,
    backgroundColor: '#045b12',
  });

  app.stage.interactive = true;

  function setup(levels) {
    let lines = 2 + levels;

    let slot_costs = SLOT_COSTS_LIST[levels - 8];

    pegs = [];
    slots = [];

    fraction = 7 / lines;

    let space_bottom = 150 * fraction;

    for (let i = 3; i <= lines; i++) {
      let space_left = 25;

      for (let space = 1; space <= lines - i; space++) {
        space_left += 50 * fraction;
      }

      for (let point = 1; point <= i; point++) {
        let beg_obj = new Peg(
          space_left,
          space_bottom,
          0,
          27 * fraction,
          27 * fraction,
          (27 * fraction) / 2
        );
        let new_beg = beg_obj.create();

        app.stage.addChild(new_beg);

        pegs.push(beg_obj);
        space_left += 100 * fraction;
      }

      space_bottom += 90 * fraction;
    }

    for (let s = 0; s < slot_costs.length; s++) {
      let temp_bottom_peg = pegs[pegs.length - 1 - slot_costs.length + s];
      let slot_obj = new Slot(
        temp_bottom_peg.x + temp_bottom_peg.width * fraction,
        space_bottom,
        0,
        55 - lines,
        50 - lines,
        slot_costs[s]
      );
      let new_slot = slot_obj.create();

      app.stage.addChild(new_slot);
      slots.push(slot_obj);
    }

    openning = PIXI.Sprite.from(`./images/bC.png`);
    openning.anchor.set(0);
    openning.x = pegs[1].x - 8 * fraction;
    openning.y = 50 * fraction;
    openning.width = 50 * fraction;
    openning.height = 50 * fraction;
    app.stage.addChild(openning);
  }

  function destroyApp() {
    document.getElementById('canvas').removeChild(app.view);

    app = new PIXI.Application({
      height: 1500,
      backgroundColor: 0x045b12,
    });

    document.getElementById('canvas').appendChild(app.view);
  }

  function roundToTwoDecimal(num) {
    return +(Math.round(num + 'e+2') + 'e-2');
  }

  setup(INITIAL_LEVEL);

  document.getElementById('canvas').appendChild(app.view);

  music = new Audio('./Sound Effects/background_music.mp3');
  music.loop = true;
  music.volume = 0.1;

  document.body.addEventListener('mousemove', () => {
    music.play();
  });

  let canvas_option_divs = document.querySelectorAll('#canvas-option_div');
  canvas_option_divs.forEach((op) => {
    op.addEventListener('click', function (e) {
      let new_level = e.target.innerHTML;
      destroyApp();
      setup(Number(new_level));

      canvas_option_divs.forEach((line_number) => {
        line_number.classList.remove('selected-line');
        if (new_level === line_number.innerHTML) {
          line_number.classList.add('selected-line');
        }
      });
    });
  });

  document.getElementById(
    'points-bet-wrapper__points--player-points'
  ).innerHTML = points;

  document
    .getElementById('points-bet-wrapper__bet--increase')
    .addEventListener('click', () => {
      if (points > bet) {
        bet += 1.0;
        document.getElementById(
          'points-bet-wrapper__bet--amount'
        ).innerHTML = `${bet}.00`;
      }
    });

  document
    .getElementById('points-bet-wrapper__bet--decrease')
    .addEventListener('click', () => {
      if (bet > 1.0) {
        bet -= 1.0;
        document.getElementById(
          'points-bet-wrapper__bet--amount'
        ).innerHTML = `${bet}.00`;
      }
    });

  document.getElementById('play-button').addEventListener('click', () => {
    let points1 = JSON.parse(
      document.getElementById('points-bet-wrapper__points--player-points')
        .textContent
    );

    if (points1 > 0 && bet <= points1) {
      points1 -= bet;
      points1 = roundToTwoDecimal(points1);
      document.getElementById(
        'points-bet-wrapper__points--player-points'
      ).innerHTML = points1;
      new Play(
        openning,
        app,
        fraction,
        pegs,
        slots,
        bet,
        topBounce,
        sideBounce
      ).start();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      music.play();
    } else {
      music.pause();
    }
  });

  document
    .getElementById('points-bet-wrapper__weight--increase')
    .addEventListener('click', () => {
      if (topBounce <= 0.5 && topBounce > 0.1) {
        topBounce -= 0.01;
        sideBounce -= 0.05;
        incrWeightValue += 1;
        document.getElementById(
          'points-bet-wrapper__weight--amount'
        ).innerHTML = `${50 + incrWeightValue}`;
      }
    });

  document
    .getElementById('points-bet-wrapper__weight--decrease')
    .addEventListener('click', () => {
      if (topBounce < 0.5 && topBounce >= 0.0) {
        topBounce += 0.01;
        sideBounce += 0.05;
        incrWeightValue -= 1;
        document.getElementById(
          'points-bet-wrapper__weight--amount'
        ).innerHTML = `${50 + incrWeightValue}`;
      }
    });
};
