// Class PlayButton


function PlayButton(gl, callback) {
  if (this === window)
    return new PlayButton(gl, callback);

  this.callback = callback;

  this.gl = gl;
  this.size_x = PlayButton.shape_width;
  this.size_y = PlayButton.shape_height;
  this.x = 0.5 - this.size_x/2;
  this.y = 0.5 - this.size_y/2;

  this.shapes = {
    background_border: {
      model: {
        vertices: MODELS.Circle(64)
      },
      size_x: this.size_x,
      size_y: this.size_y,
      x: x => x + this.size_x/2,
      y: y => y + this.size_y/2,
      color: [1.0, 1.0, 1.0, 1.0],
    },

    background: {
      model: {
        vertices: MODELS.Circle(64),
      },
      size_x: this.size_x * .98,
      size_y: this.size_y * .98,
      x: x => x + this.size_x/2,
      y: y => y + this.size_x/2,
      color: [.1, .1, .1, 1.0],
    },

    play: {
      model: {
        vertices: MODELS.Play1(),
      },
      size_x: this.size_x / 2,
      size_y: this.size_y / 2,
      x: x => x + this.size_x * .55,
      y: y => y + this.size_y/2,
      color: [0.0, 1.0, 0.0, 1.0],
    },
  };

  return this;
}


PlayButton.shape_width  = 0.2;
PlayButton.shape_height = 0.2;

PlayButton.prototype = {
  gl_init(gl) {
    for (let shape of Object.values(this.shapes))
      gl.create_buffer(shape.model);
    this.gl.canvas.addEventListener("click", event => this.check_click(event));
  },

  render(gl) {
    for (const key of ['background_border', 'background', 'play']) {
      const shape = this.shapes[key];
      gl.draw(shape.model, gl.TRIANGLES, {
        color : shape.color,
        trans : [shape.x(this.x), shape.y(this.y)],
        scale : [shape.size_x, shape.size_y],
      });
    }
    return true;
  },

  colision(x, y) {
    return !(
      ((this.y + this.size_y) < y) ||
        (this.y > y) ||
        ((this.x + this.size_x) < x ||
         (this.x > x))
    );
  },

  check_click(event) {
    console.log("PlayButton: CLICK", event);

    // Get canvas and mouse properties
    const box = this.gl.canvas.getBoundingClientRect();
    const real_x = event.clientX;
    const real_y = event.clientY;

    // Translate to ingame x and y
    const x = (real_x - box.x) / box.width;
    const y = (real_y - box.y) / box.height;

    // Check if we were clicked
    if (this.colision(x, y))
      this.callback();
  }
};
