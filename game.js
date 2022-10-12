// Class Game



function Game(graphics, level, dumb) {
  if (this === window)
    return new Game(graphics, level, dumb);

  // Constants
  this.keys_move_left   = new Set(["arrowleft",  "a"]);
  this.keys_move_right  = new Set(["arrowright", "s", "d"]);
  this.keys_shot        = new Set(["arrowup",    " ", "w"]);
  this.keys_hack        = new Set(["x"]);
  this.player_shot_wait = 500; // In miliseconds
  this.background       = [0.0, 0.0, 0.0, 1.0];

  // HACKED ////////
  // this.player_shot_wait = 10;
  // ////////////////

  // Parameters
  this.dumb = dumb;
  this.gl = graphics;
  this.move_enemies = false;
  this.score_callback = () => {};
  this.start_callback = () => {};
  this.end_callback   = () => {};
  this.level = new Level(level || 1);

  // Automaticly initialized
  this.program  = null;
  this.gl_ids   = {};
  this.interval = null;
  this.next_enemy_shot = 20;
  this._render = true;
  this.score   = 0;
  this.player_last_shot = 0;
  this.player_shoting = false;
  this.player_hacking = false;
  this.move_player = true;
  this.playbtn = new PlayButton(this.gl, () => this.play_button_callback());

  // Inicialitzation
  this.army    = null;
  this.arsenal = null;
  this.spaceship = new Spaceship(0, 1, .95, () => this.game_over());
  this.generate_army();
  this.generate_arsenal();
  return this;
}

Game.prototype = {
  get ENABLE_HACKS() {
    return true;
  },

  init() {
    this.gl_init();
    if (!this.dumb)
      this.install_keyboard();
    this.gl.clear();
    requestAnimationFrame(() => {
      this.draw();
      this.playbtn.render(this.gl);
    });
  },

  gl_init() {
    this.gl.clear();
    this.army.gl_init(this.gl);
    this.arsenal.gl_init(this.gl);
    this.spaceship.gl_init(this.gl);
    this.playbtn.gl_init(this.gl);
  },

  generate_army() {
    this.army = new EnemyArmy(
      1,
      0.85,
      this.level,
      () => this.enemy_killed(),
      () => this.winner_winner_chicken_dinner(),
      () => this.game_over(),
    );
  },

  generate_arsenal() {
    // Do this after this.generate_army()
    this.arsenal = new Arsenal(this.gl, this.army, this.spaceship, 0.0, 1.0);
  },

  bind_score_callback(callback) {
    this.score_callback = callback;
  },

  bind_start_callback(callback) {
    this.start_callback = callback;
  },

  bind_end_callback(callback) {
    this.end_callback = callback;
  },

  play_button_callback() {
    if (this.dumb)
      return;
    this.level = new Level(1);
    this.next_level(this.level);
  },

  start_loop() {
    try {
      clearInterval(this.interval);
    } catch (err) {}
    this.interval = setInterval(() => this.tick(), 15);
    this.draw_loop();
  },

  install_keyboard() {
    document.addEventListener("keydown", event => this.keydown(event));
    document.addEventListener("keyup", event => this.keyup(event));
  },

  keydown(event) {
    if (event.repeat)
      return;
    const key = event.key.toLowerCase();
    if (this.move_player) {
      if (this.keys_move_right.has(key)) {
        if (!this.move_enemies)
          this.game_start();
        this.spaceship.move_right();
      }
      else if (this.keys_move_left.has(key)) {
        if (!this.move_enemies)
          this.game_start();
        this.spaceship.move_left();
      }
      else if (this.move_enemies && this.keys_shot.has(key)) {
        this.player_shoting = true;
        this.player_shot();
      }
      else if (this.ENABLE_HACKS && this.move_enemies && this.keys_hack.has(key))
        this.player_hacking = true;
    }
  },

  keyup(event) {
    const key = event.key.toLowerCase();
    const movedir = this.spaceship.moving_direction;
    if ((movedir == 'right' && this.keys_move_right.has(key))
        || (movedir == 'left' && this.keys_move_left.has(key)))
      this.spaceship.move_stop();
    else if (this.keys_shot.has(key))
      this.player_shoting = false;
    else if (this.keys_hack.has(key))
      this.player_hacking = false;
  },

  enemy_shot() {
    this.arsenal.shot(this.army.random_enemy());
    this.next_enemy_shot = (this.enemy_shot_probability_max
                            * (Math.random() * (1-this.enemy_shot_probability)));
  },

  player_shot() {
    let now = (new Date()).getTime();
    if (now < this.player_last_shot + this.player_shot_wait)
      return; // Can't shoot yet
    this.player_last_shot = now;
    this.arsenal.shot(this.spaceship);
  },

  tick() {
    if (this.move_player)
      this.spaceship.tick();
    this.arsenal.tick();
    if (this.move_enemies) {
      if (this.player_shoting)
        this.player_shot();
      if (this.player_hacking)
        this.arsenal.shot(this.spaceship);
      this.army.tick();
      if (--this.next_enemy_shot <= 0)
        this.enemy_shot();
    }
  },

  draw_loop() {
    this.draw();
    if (this._render)
      requestAnimationFrame(() => this.draw_loop());
  },

  draw() {
    this.arsenal.render(this.gl);
    this.army.render(this.gl);
    this.spaceship.render(this.gl);
  },

  get enemy_shot_probability() {
    return this.level.enemy_shot_probability;
  },

  get enemy_shot_probability_max() {
    return this.level.enemy_shot_probability_max;
  },

  enemy_killed() {
    this.score++;
    setTimeout(() => this.score_callback(this.score), 1); // async
  },

  next_level(level) {
    if (this._stop)
      return;
    this.level = level || this.level.next();
    this.generate_army();
    this.army.gl_init(this.gl);
    this.generate_arsenal();
    this.arsenal.gl_init(this.gl);
    this.game_start();
  },

  game_start() {
    if (this.army.alive <= 0)
      return;
    this.next_enemy_shot = 20;
    this.move_enemies = true;
    this.move_player  = true;
    this._render = true;
    this.gl.background = this.background;
    this.gl.clear();
    if (this.level.number == 1)
      setTimeout(() => this.start_callback(false), 1); // async
    this.start_loop();
  },

  game_over() {
    this.move_enemies = false;
    this.move_player  = false;
    clearInterval(this.interval);
    this.gl.background = [1.0, 0.0, 0.0, 1.0];
    this.gl.clear();
    this._render = false;
    setTimeout(() => this.end_callback(false), 1); // async
    setTimeout(() => {
      this.draw();
      this.arsenal.destroy();
      this.playbtn.render(this.gl);
    }, 2000);
  },

  winner_winner_chicken_dinner() {
    this.move_enemies = false;
    this.arsenal.destroy();
    setTimeout(() => this.next_level(), 2000); // async
    // clearInterval(this.interval);
  },

  uninstall() {
  },
};
