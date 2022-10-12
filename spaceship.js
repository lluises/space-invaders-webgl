// Class Enemy


function Spaceship(limit_left, limit_right, y, game_over_callback) {
  if (this === window)
    return new Spaceship(limit_left, limit_right, y, game_over_callback);

  this.game_over   = game_over_callback;
  this.size_x      = Spaceship.shape_width;
  this.size_y      = Spaceship.shape_height;
  this.limit_left  = limit_left;
  this.limit_right = limit_right;
  this.x = (limit_right + limit_left) / 2;
  this.y = y;

  this.speed = 0.01;
  this.moving = false; // 0: nope, -1: left, +1: right

  this._color = [1.0, 1.0, 1.0, 1.0];

  this.gl_shape = { // TODO
  };

  this.shapes = {
    original: {
      model: {vertices: MODELS.Spaceship1()},
      size_x: this.size_x,
      size_y: this.size_y,
      x: x => x,
      y: y => y,
    },

    base_border: {
      model: {vertices: MODELS.Spaceship2_base()},
      size_x: this.size_x,
      size_y: this.size_y,
      x: x => x,
      y: y => y,
      
      color: [ 80,  13,   6, 255].map(x => x/255),
      // color: [255, 255, 255, 255].map(x => x/255),
    },

    base: {
      model: {vertices: MODELS.Spaceship2_base()},
      size_x: this.size_x * .9,
      size_y: this.size_y * .9,
      x: x => x,
      y: y => y,
      
      color: [167,  22,  20, 255].map(x => x/255),
    },

    glass: {
      model: {vertices: MODELS.Spaceship2_glass()},
      size_x: this.size_x * .07,
      size_y: this.size_y * .07,
      x: x => x,
      y: y => y - this.size_y * .1,
      color: [130, 213, 220, 255].map(x => x/255),
    },

    head_and_motor: {
      model: {vertices: MODELS.Spaceship2_head_and_motor()},
      size_x: this.size_x * 0.08,
      size_y: this.size_y * 0.08,
      x: x => x,
      y: y => y + this.size_y * 0.04,
      color: [ 52,  52,  59, 255].map(x => x/255),
    },

    decoration1: {
      model: {vertices: MODELS.Circle(6)},
      size_x: this.size_x * 0.2,
      size_y: this.size_y * 0.2,
      x: x => x - this.size_y * 0.35,
      y: y => y + this.size_y * 0.2,
      // color: [198, 192,  76, 255].map(x => x/255),
      color: [108, 198, 75, 255].map(x => x/255),
    },

    decoration2: {
      model: {vertices: MODELS.Circle(6)},
      size_x: this.size_x * 0.2,
      size_y: this.size_y * 0.2,
      x: x => x + this.size_y * 0.35,
      y: y => y + this.size_y * 0.2,
      // color: [198, 192,  76, 255].map(x => x/255),
      color: [108, 198, 75, 255].map(x => x/255),
    },
    // vertices: MODELS.Spaceship2_base(),
  };

  this.shape_order = [
    'base_border',
    'head_and_motor',
    'base',
    'glass',
    'decoration1',
    'decoration2'
  ];

  return this;
}

// Spaceship.shape_width  = 0.1;
// Spaceship.shape_height = 0.1;

Spaceship.shape_width  = 0.03;
Spaceship.shape_height = 0.03;

Spaceship.prototype = {
  gl_init(gl) {
    for (let shape of Object.values(this.shapes))
      gl.create_buffer(shape.model);
  },

  render(gl) {
    for (const key of this.shape_order) {
      const shape = this.shapes[key];
      gl.draw(shape.model, gl.TRIANGLES, {
        color : shape.color,
        trans : [shape.x(this.x)+this.size_x/2, shape.y(this.y)+this.size_y/2],
        scale : [shape.size_x, shape.size_y],
      });
    }
    return true;
  },

  tick() {
    if (!this.moving)
      return;
    this.x += this.speed * this.moving;
    if (this.x > this.limit_right - this.size_x)
      this.x = this.limit_right - this.size_x;
    else if (this.x < this.limit_left + this.size_x)
      this.x = this.limit_left + this.size_x;
  },

  move_right() {
    this.moving = +1;
  },

  move_left() {
    this.moving = -1;
  },

  move_stop() {
    this.moving = 0;
  },

  get moving_direction() {
    return (!this.moving ? false : (this.moving > 0 ? 'right' : 'left'));
  },

  get color() {
    return this._color;
  },

  set color(rgba) {
    this._color = rgba;
  },

  get speed() {
    return this.speed_x;
  },

  set speed(s) {
    this.speed_x = s;
  },

  set_window(width) {
    this.width = width;
  },

  kill() {
    this.game_over();
  },
};
