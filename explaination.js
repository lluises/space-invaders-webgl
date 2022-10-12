function banner() {
  let graphics = Graphics(document.getElementById('banner'));
  graphics.set_scale(1.65, 2.1);
  let game = new Game(graphics, 2, true);
  game.gl_init();
  game.draw();
}

function enemy_strip() {
  const sx = 1;
  const sy = 10;
  let enemies = [];
  let graphics = null;
  let last_new = 0;

  function render() {
    let now = (new Date()).getTime();
    if (now > last_new + 600) {
      last_new = now;
      enemies.push(new_enemy());
    }
    graphics.clear();
    for (let e of enemies) {
      e.tick();
      e.render(graphics);
    }
    requestAnimationFrame(render);
  }

  let flag = new Flag(Flag.RAINBOW);
  let colors = 0;
  function new_enemy() {
    let enemy = new Enemy(
      1/sx,
      1,
      0,
      (1/sy)/2 - (Enemy.shape_height),
      // sy/2 - (Enemy.shape_height * .5),
      0.003,
      e => { e.kill(); },
      e => { enemies.splice(enemies.indexOf(e), 1); },
    );
    enemy.color = [...flag.color(1, colors++), 1.0];
    enemy.gl_init(graphics);
    return enemy;
  }

  graphics = Graphics(document.getElementById('enemy-strip'));
  graphics.background = [0, 0, 0, 1.0];
  graphics.set_scale(sx, sy);
  graphics.clear();

  window.enemy_interval_spawn = setInterval(() => {
    
  }, 1000);

  render();
}

function enemy(type, elemid) {
  const scale = 20;
  let graphics = Graphics(document.getElementById(elemid));
  graphics.background = [1, 1, 1, 1.0];
  graphics.set_scale(scale, scale);
  graphics.force_draw_type(type ? graphics[type] : false);
  graphics.clear();
  let enemy = new Enemy(
    0,
    1,
    (0.15 - Enemy.shape_width)/scale,
    (0.15 - Enemy.shape_height)/scale,
    0,
    () => {},
    () => {},
  );
  enemy.color = [0.0, 0.0, 1.0, 1.0];
  enemy.gl_init(graphics);
  enemy.render(graphics);
}

function spaceship(type, elemid) {
  const scale = 15;
  let graphics = Graphics(document.getElementById(elemid));
  graphics.background = [1, 1, 1, 1.0];
  graphics.set_scale(scale, scale);
  graphics.force_draw_type(type ? graphics[type] : false);
  graphics.clear();
  let spaceship = new Spaceship(
    0,
    1,
    (0.35 - Spaceship.shape_height)/scale,
    () => {},
  );
  spaceship.x = (.3 - Spaceship.shape_width/2)/scale;
  spaceship.gl_init(graphics);
  spaceship.render(graphics);
}

function bullet(type, elemid) {
  const scale = 40;
  let graphics = Graphics(document.getElementById(elemid));
  graphics.background = [1, 1, 1, 1.0];
  graphics.set_scale(scale, scale);
  graphics.force_draw_type(type ? graphics[type] : false);
  graphics.clear();
  let bullet = new Bullet(
    null,
    (0.5 - Bullet.shape_width)/scale,
    (0.5 - Bullet.shape_height)/scale,
    (0.5 - Bullet.shape_height)/scale,
    0,
    () => {},
  );
  bullet.color = [0.0, 0.0, 1.0, 1.0];
  bullet.gl_init(graphics);
  bullet.render(graphics);
}

function playbutton(type, elemid) {
  const scale = 2;
  let graphics = Graphics(document.getElementById(elemid));
  graphics.set_scale(scale, scale);
  graphics.background = [.7, .7, .7, 1.0];
  graphics.clear();
  graphics.force_draw_type(type ? graphics[type] : false);
  let play = new PlayButton(graphics, alert.bind(null, "にゃー！ You found an easteregg"));
  play.gl_init(graphics);
  play.x = (.5 - PlayButton.shape_width)/scale;
  play.y = (.5 - PlayButton.shape_height)/scale;
  play.render(graphics);
}

function create_table_of_contents() {
  let toc = document.getElementById("toc");
  toc.innerHTML = "";
  let parts = document.getElementsByClassName("@");
  let i = 1;
  for (const section of parts) {
    section.id = `${i}-${section.innerText}`;
    let level = ['h1', 'h2', 'h3', 'h4', 'h5'].indexOf(section.nodeName.toLowerCase());
    level++;
    if (level <= 0)
      level = 1;
    let div = document.createElement("div");
    let span = document.createElement("div");
    span.innerText = `${i}　`;
    span.className = "toc-entry-number";
    div.appendChild(span);
    let a = document.createElement("a");
    a.href = '#'+section.id;
    a.innerText = `${section.innerText}`;
    a.classList.add("toc-entry");
    a.classList.add(`toc-entry-${level}`);
    div.appendChild(a);
    toc.appendChild(div);
    i++;
  }
}

function main() {
  create_table_of_contents();
  banner();
  enemy_strip();
  enemy(false, 'enemy-full');
  enemy('LINES', 'enemy-lines');
  spaceship(false, 'spaceship-full');
  spaceship('LINE_STRIP', 'spaceship-lines');
  bullet(false, 'bullet-full');
  bullet('LINE_LOOP', 'bullet-lines');
  playbutton(false, 'playbutton-full');
  playbutton('LINE_LOOP', 'playbutton-lines');
}

window.onload = main;
