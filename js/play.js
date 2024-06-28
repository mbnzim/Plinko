export class Play {
  constructor(
    openning,
    app,
    fraction,
    pegs,
    slots,
    bet,
    top_bounce,
    side_bounce
  ) {
    this.openning = openning;
    this.app = app;
    this.fraction = fraction;
    this.pegs = pegs;
    this.slots = slots;
    this.greenBall = PIXI.Sprite.from(`./images/green_ball.png`);
    this.cost_scored = 0;
    this.bet = bet;
    this.time = Date().split(' ')[4];
    this.slotCost = 0;
    this.top_bounce = top_bounce;
    this.side_bounce = side_bounce;
  }

  start() {
    window.document
      .getElementById('points-bet-wrapper__won-flash')
      .classList.remove('points-bet-wrapper__won-flash__animate');
    this.greenBall.x = this.openning.x + 5 * this.fraction;
    this.greenBall.y = this.openning.y;
    this.greenBall.width = 50 * this.fraction;
    this.greenBall.height = 50 * this.fraction;
    this.greenBall.vy = 0;
    this.greenBall.vx = 0;
    this.app.stage.addChild(this.greenBall);

    let last_peg = undefined;
    let randomTurn = Math.floor(Math.random() * 2);

    let obj = this;
    this.app.ticker.add(function () {
      obj.greenBall.y += obj.greenBall.vy;
      obj.greenBall.vy += 0.7;

      for (let pegIndx = 0; pegIndx < obj.pegs.length; pegIndx++) {
        if (
          obj.isCollision(
            obj.pegs[pegIndx].x - 1 * obj.fraction,
            obj.pegs[pegIndx].y,
            obj.pegs[pegIndx].radius,
            obj.greenBall.x,
            obj.greenBall.y,
            obj.greenBall.width / 2
          )
        ) {
          obj.pegs[pegIndx].pegBall.tint = 0x23f61e;
          setTimeout(() => {
            obj.pegs[pegIndx].pegBall.tint = 0xffffff;
          }, 100);

          let collisionSoundEffect = new Audio(
            './Sound Effects/collisionEffect.wav'
          );
          collisionSoundEffect.volume = 0.2;
          collisionSoundEffect.play();

          let current_peg = obj.pegs[pegIndx];

          obj.greenBall.vy *= -obj.top_bounce + 0.2;
          obj.greenBall.y += obj.greenBall.vy;
          obj.greenBall.vx += obj.side_bounce;
          obj.greenBall.vx = obj.greenBall.vx * obj.fraction;

          if (current_peg != last_peg) {
            randomTurn = Math.floor(Math.random() * 2);
            last_peg = current_peg;
          }

          if (randomTurn === 0) {
            obj.greenBall.x -= obj.greenBall.vx;
          } else if (randomTurn === 1) {
            obj.greenBall.x += obj.greenBall.vx;
          }

          break;
        }
      }

      for (let slotIndx = 0; slotIndx < obj.slots.length; slotIndx++) {
        if (
          obj.isCollision(
            obj.slots[slotIndx].x,
            obj.slots[slotIndx].y + 40,
            obj.slots[slotIndx].width / 2,
            obj.greenBall.x,
            obj.greenBall.y,
            obj.greenBall.width / 2
          )
        ) {
          obj.app.stage.removeChild(obj.greenBall);
          let scoredSoundEffect = new Audio('./Sound Effects/scoreEffect.wav');
          scoredSoundEffect.volume = 0.2;
          scoredSoundEffect.play();
          if (obj.cost_scored === 0) {
            obj.slotCost = obj.slots[slotIndx].cost;
            obj.cost_scored = obj.roundToTwoDecimal(
              obj.getCostScored(obj.bet, obj.slotCost)
            );

            const pointUpdate = document.getElementById(
              'points-bet-wrapper__points--player-points'
            ).textContent;

            window.points = JSON.parse(pointUpdate) + obj.cost_scored;
            window.points = obj.roundToTwoDecimal(window.points);
            window.document.getElementById('points-won').innerHTML =
              obj.cost_scored;
            document.getElementById(
              'points-bet-wrapper__points--player-points'
            ).innerHTML = window.points;

            window.document
              .getElementById('points-bet-wrapper__won-flash')
              .classList.add('points-bet-wrapper__won-flash__animate');

            window.document.getElementById(
              'game-history-table-body'
            ).innerHTML += `<tr>
                                <td style='font-size: 20px;' colspan="1">${
                                  obj.time
                                }</td>
                                <td style='font-size: 20px;'>${obj.bet}</td>
                                <td style='font-size: 20px;'>${
                                  obj.slotCost
                                }x</td>
                                ${
                                  obj.cost_scored > obj.bet
                                    ? `<td style='font-size: 20px;' class="td-won"><div>${obj.cost_scored}</div></td>`
                                    : obj.cost_scored < obj.bet
                                    ? `<td style='font-size: 20px;' class="td-lost"><div>${obj.cost_scored}</div></td>`
                                    : `<td style='font-size: 20px;' class="td-no-gain"><div>${obj.cost_scored}</div></td>`
                                }
                            </tr>`;

            let tableWrapper = window.document.getElementById('table-wrapper');
            tableWrapper.scrollTop = tableWrapper.scrollHeight;

            obj.slots[slotIndx].slot.y += 10;
            setTimeout(() => {
              obj.slots[slotIndx].slot.y -= 10;
            }, 50);
          }
        }
      }
    });
  }

  // isCollision(peg_x, peg_y, peg_r, ball_x, ball_y, ball_r) {
  //   let circleDistance =
  //     (peg_x - ball_x) * (peg_x - ball_x) + (peg_y - ball_y) * (peg_y - ball_y);
  //   return circleDistance <= (peg_r + ball_r) * (peg_r + ball_r);
  // }

  isCollision(peg_x, peg_y, peg_r, ball_x, ball_y, ball_r) {
    // Calculate the squared distance between the centers of the peg and the ball.
    const dx = peg_x - ball_x;
    const dy = peg_y - ball_y;
    const circleDistanceSquared = dx * dx + dy * dy;

    // Calculate the squared sum of the radii.
    const radiiSumSquared = (peg_r + ball_r) ** 2;

    // Check if the squared distance is less than or equal to the squared sum of the radii.
    return circleDistanceSquared <= radiiSumSquared;
  }

  getCostScored(bet, slot_cost) {
    return bet * slot_cost;
  }

  roundToTwoDecimal(num) {
    return +(Math.round(num + 'e+2') + 'e-2');
  }
}
