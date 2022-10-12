// Class Enemy


function Enemy(width, height, x, y, speed, bounce_callback, die_callback) {
  if (this === window)
    return new Enemy(width, height, x, y, bounce_callback, die_callback);

  this.size_x = Enemy.shape_width;
  this.size_y = Enemy.shape_height;
  this.x = x + this.size_x;
  this.y = y + this.size_y;
  this.target_y = 0;

  this.width  = width;
  this.height = height;
  this.speed_x = speed || 0.01;
  this.speed_y = 0;
  this.die_state = 0;
  this.angle = 0;
  this.bounce_callback = bounce_callback;
  this.die_callback    = die_callback;

  this.die_state_max = 20;
  this._color = [1.0, 1.0, 0.0, 1.0];
  this._color = [
    Math.abs(0-this.x*2),
    this.y * 3,
    Math.abs(0.7-this.y), 1.0
  ];

  const W = Enemy.shape_width;
  const H = Enemy.shape_height;
  // const px = W/12;
  const px = 1/12;

  this.gl_shape = { // TODO: Use same gl shape buffer for all enemies
    vertices: MODELS.Enemy1()
  };

  // this.gl_shape = { // TODO: Use same gl shape buffer for all enemies
  //   vertices: [
  //     -1.0, -1.0, .0,
  //     -1.0,  1.0, .0,
  //      1.0,  1.0, .0,
  //      1.0, -1.0, .0,
  //   ],
  //   indices: [0, 1, 2, 0, 2, 3],
  // };

  return this;
}

Enemy.shape_width  = 0.02;
Enemy.shape_height = 0.02;

Enemy.prototype = {
  gl_init(gl) {
    gl.create_buffer(this.gl_shape);
  },

  render(gl) {
    gl.draw(this.gl_shape, gl.TRIANGLES, {
      color : this._color,
      trans : [this.x, this.y],
      rot   : this.angle,
      scale : [this.size_x, this.size_y],
    });
    return true;
  },

  tick() {
    if (this.die_state > 0) {
      // Die animation
      if (this.die_state > this.die_state_max) {
        this.die_callback(this);
        return;
      }
      const state = this.die_state / this.die_state_max;
      this._color[0] = 1-state;
      this._color[1] = 1-state;
      this._color[2] = 1-state;
      this._color[3] = 1-state;
      // this.angle = 2 * Math.pi * state;
      // this.angle = state * Math.sign(this.speed_x);
      this.size_x = ((this.die_state_max - this.die_state) / this.die_state_max) * Enemy.shape_width;
      this.size_y = ((this.die_state_max - this.die_state) / this.die_state_max) * Enemy.shape_height;
      this.die_state++;

    } else if (this.speed_y > 0) {
      // Move vertically
      if (this.y < this.target_y) {
        this.y += this.speed_y;
      } else {
        this.speed_y = 0;
        this.speed_x = -this.speed_x;
        this.tick();
      }

    } else {
      // Move horitzontally
      this.x += this.speed_x;
      if (this.x < this.size_x || this.x > this.width - this.size_x) {
        this.x -= this.speed_x;
        this.bounce_callback(this);
      }
    }
  },

  move_row(margin_y) {
    this.target_y = this.y + this.size_y + margin_y;
    this.speed_y = Math.abs(this.speed_x);
  },

  get color() {
    return this._color;
  },

  set color(rgba) {
    this._color = rgba;
  },

  get speed() {
    return Math.abs(this.speed_x);
  },

  set speed(s) {
    if (this.speed_x < 0)
      this.speed_x = -s;
    else
      this.speed_x = s;
  },

  get alive() {
    return this.die_state <= 0;
  },

  set_window(width, height) {
    this.width  = width;
    this.height = height;
  },

  kill() {
    this.die_state = 1;
  },
};
