// Class Enemy
// Speed > 0 → upwards, speed < 0 → downwards


function Bullet(owner, x, start, end, speed, vanish_callback) {
  if (this === window)
    return new Bullet(owner, start, end, speed);

  this.size_x = Bullet.shape_width;
  this.size_y = Bullet.shape_height;
  this.start  = start;
  this.end    = end;
  this.x      = x;
  this.y      = this.start;
  this.owner  = owner;
  this.ship_owner = owner instanceof Spaceship;
  this.vanish_callback = vanish_callback;

  this.speed  = speed;
  this.angle  = 0;
  this.moving = false; // 0: nope, -1: left, +1: right

  this._color = [1.0, 1.0, 0.0, 1.0];

  this.gl_shape = {
    vertices: MODELS.Oval(12, 1, 2)
  };

  return this;
}

Bullet.shape_width  = 0.015;
Bullet.shape_height = 0.015;

Bullet.prototype = {
  gl_init(gl) {
    gl.create_buffer(this.gl_shape);
  },

  render(gl) {
    gl.draw(this.gl_shape, gl.TRIANGLES, {
      color : this._color,
      trans : [this.x, this.y],
      rot   : this.angle,
      scale : [this.size_x/2, this.size_y/2],
    });
    return true;
  },

  tick() {
    if ((this.speed > 0 && this.y > this.end)
        || (this.speed < 0 && this.y < this.end))
      this.vanish_callback(this);
    this.y += this.speed;
    // this.angle += 0.05;
  },

  colision(obj) {
    return !(
      ((this.y + this.size_y) < (obj.y)) ||
        (this.y > (obj.y + obj.size_y)) ||
        ((this.x + this.size_x) < obj.x) ||
        (this.x > (obj.x + obj.size_x))
    );
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

  kill() {
    this.y = 2;
    this.vanish_callback(this);
  },
};
