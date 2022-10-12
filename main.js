function update_time(start) {
  const now = (new Date()).getTime()/1000 >> 0;
  const diff = now - start;
  const mins = '' + ((diff / 60) >> 0);
  const secs = '' + diff % 60;
  const text = mins.padStart(2, '0') + ':' + secs.padStart(2, '0');
  document.getElementById("time").innerText = text;
}

function update_score(score) {
  document.getElementById("score").innerText = (""+score).padStart(3, '0');
}

function game_start() {
  const start = (new Date()).getTime()/1000 >> 0;
  window.timer = setInterval(update_time.bind(null, start), 1000);
}

function game_end() {
  clearInterval(window.timer);
}

function main() {
  let graphics = Graphics(document.getElementById('myCanvas'));
  window.graphics = graphics;

  let game = new Game(graphics);
  window.game = game;
  game.bind_score_callback(update_score);
  game.bind_start_callback(game_start);
  game.bind_end_callback(game_end);
  game.init();
}

window.onload = main;
