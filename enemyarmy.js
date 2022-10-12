// Class EnemyArmy


function EnemyArmy(width, height, level, enemy_killed_callback, ggwl_callback, game_over_callback) {
  if (this === window)
    return new EnemyArmy(width, height, level, enemy_killed_callback, ggwl_callback);

  this.level   = level;
  this.flag    = this.level.flag;
  this.width   = width;
  this.height  = height;
  this.enemies = []; // Sorted bottom to top, right to left
  this._speed  = this.level.enemy_speed;
  this.speed_increment = this.level.enemy_speed_gain;
  this.enemy_margin = this.level.enemy_margin; // For initial positioning

  this.ggwl_callback = ggwl_callback;
  this.enemy_killed_callback = enemy_killed_callback;
  this.game_over_callback = game_over_callback;

  this._create_enemies();
  return this;
}

EnemyArmy.prototype = {
  gl_init(gl) {
    return this.enemies.map(e => e.gl_init(gl));
  },

  render(gl) {
    return this.enemies.map(e => e.render(gl));
  },

  tick() {
    for (const e of this.enemies)
      e.tick();
  },

  random_enemy() {
    return this.enemies[Math.floor(Math.random()*this.enemies.length)];
  },

  bounce() {
    // An enemy has reached a corner, bounce them all
    this.speed += this.speed_increment;
    for (const e of this.enemies) {
      e.move_row(this.enemy_margin.y);
      if (e.y >= this.height) {
        this.game_over_callback();
        break;
      }
    }
  },

  defunct(enemy) {
    // Eliminate defuncted enemy from this.enemies.
    const index = this.enemies.indexOf(enemy);
    if (index < 0)
      console.warn(`ERROR: Defuncted a zombie ${enemy}`);
    else
      this.enemies.splice(index, 1);
    this.enemy_killed_callback();
    if (this.enemies.length <= 0)
      this.ggwl_callback();
  },

  get speed() {
    return this._speed;
  },

  set speed(s) {
    this._speed = s;
    for (let e of this.enemies)
      e.speed = this._speed;
  },

  get alive() {
    return this.enemies.length;
  },

  _create_enemies() {
    const matrix = this.level.enemy_matrix;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          let enemy = new Enemy(
            this.width,
            this.height,
            x * (Enemy.shape_width + this.enemy_margin.x) + this.enemy_margin.x,
            this.enemy_margin.top + y * (Enemy.shape_height + this.enemy_margin.y),
            this._speed,
            () => this.bounce(),
            e => this.defunct(e),
          );
          enemy.color = this.flag.color(x, y);
          this.enemies.push(enemy);
        }
      }
    }
    this.enemies.reverse();
  },
};
