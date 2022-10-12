// Class Arsenal
// A class to manage bullets


function Arsenal(gl, army, spaceship, top, bottom) {
  if (this === window)
    return new Arsenal(gl, army, spaceship, top, bottom);

  this.gl        = gl;
  this.army      = army;
  this.spaceship = spaceship;
  this.top       = top;
  this.bottom    = bottom;
  this.bullets   = []; // Sorted bottom to top, right to left

  this.speed = 0.015;

  return this;
}

Arsenal.prototype = {
  gl_init(gl) {
    // Do nothing
  },

  render(gl) {
    return this.bullets.map(b => b.render(gl));
  },

  tick() {
    let target;
    for (const b of this.bullets) {
      b.tick();
      this.colisions(b);
    }
  },

  colisions(b) {
    for (const b of this.bullets) {
      if (b.ship_owner) {
        // Colisions with army
        for (const e of this.army.enemies) {
          if (e.alive && b.colision(e)) {
            e.kill();
            b.kill();
            break;
          }
        }
      } else {
        // Colisions with spaceship
        if (b.colision(this.spaceship)) {
          // b.kill();
          this.spaceship.kill();
        }
      }
      // Colision with other bullets
      for (const b2 of this.bullets) // TODO: Efficientcy
        if (b != b2 && b.owner != b2.owner && b.colision(b2)) {
          b2.kill();
          b.kill();
        }
    }
    return null;
  },

  defunct(bullet) {
    // Eliminate defuncted bullet from this.bullets.
    const index = this.bullets.indexOf(bullet);
    if (index < 0)
      console.warn(`ERROR: Defuncted a zombie bullet ${bullet}`);
    else
      this.bullets.splice(index, 1);
  },

  destroy() {
    // Destroy the whole arsenal
    for (let b of this.bullets)
      b.kill();
  },

  shot(owner) {
    // Owner must have owner.x, owner.y, owner.size_x, owner.size_y.
    const is_ship = owner instanceof Spaceship;
    let start = owner.y;
    let end = this.bottom;
    let dir = 1;
    if (is_ship) {
      end = this.top;
      dir = -1;
    }
    let b = new Bullet(
      owner,
      owner.x + owner.size_x/2,
      start,
      end,
      this.speed * dir,
      b => this.defunct(b)
    );
    b.color = [...owner.color];
    b.gl_init(this.gl);
    this.bullets.push(b);
  },
};
