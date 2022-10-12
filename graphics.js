// Class Graphics


function Graphics(canvas) {
  if (this === window)
    return new Graphics(canvas);

  this.canvas = canvas;
  this.gl = this.canvas.getContext("webgl2");
  if (!this.gl)
    throw "Invalid WebGL2 context";

  // Constants
  this.TRIANGLE_STRIP = this.gl.TRIANGLE_STRIP;
  this.TRIANGLES      = this.gl.TRIANGLES;
  this.LINES          = this.gl.LINES;
  this.LINE_STRIP     = this.gl.LINE_STRIP;
  this.LINE_LOOP      = this.gl.LINE_LOOP;
  this.POINTS         = this.gl.POINTS;
  this._DEFAULTS = {
    color      : [1.0, 0.0, 1.0, 1.0],
    trans      : [0.0, 0.0],
    rot        : 0.0,
    scale      : [1.0, 1.0],
    resolution : [1.0, 1.0],
  },

  // Automatic
  this._background = null;
  this.program     = null;
  this.ids         = null;
  this.scale       = [1.0, 1.0];
  this.forced_type = null;

  // Init stuff
  this.init_shaders();
  this.init_ids();

  return this;
}

Graphics.prototype = {
  get width() {
    return this.canvas.width;
  },

  get height() {
    return this.canvas.height;
  },

  set background(val) {
    if (val.length != 4)
      throw "Invalid value for background color. Expected [r, g, b, a]";
    this._background = val;
    this.gl.clearColor(...this._background);
  },

  get background() {
    return this._background;
  },

  init_shaders() {
    let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
    this.gl.compileShader(vertexShader);

    let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
    this.gl.compileShader(fragmentShader);

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);

    this.gl.linkProgram(this.program);

    this.gl.useProgram(this.program);

    this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
  },

  init_ids() {
    this.ids = {
      color      : this.gl.getUniformLocation(this.program, "myColor"),
      resolution : this.gl.getUniformLocation(this.program, "u_resolution"),
      trans      : this.gl.getUniformLocation(this.program, "u_translation"),
      rot        : this.gl.getUniformLocation(this.program, "u_rotation"),
      scale      : this.gl.getUniformLocation(this.program, "u_scale"),
    };
    this.gl.uniform2f(this.ids.resolution, ...this._DEFAULTS.resolution);
  },

  set_scale(x, y) {
    this.scale = [x, y];
  },

  force_draw_type(type) {
    // type false to disable.
    this.forced_type = type || null;
  },

  create_buffer(model) {
    // Vertices
    model.idBufferVertices = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.idBufferVertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.gl.STATIC_DRAW);
    return model;
  },

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  },

  draw(model, type, attrs) {
    attrs = attrs || {};
    let color  = attrs.color  || this._DEFAULTS.color;
    let trans  = attrs.trans  || this._DEFAULTS.trans;
    let angle  = attrs.rot    || this._DEFAULTS.rot;
    let scale  = attrs.scale  || this._DEFAULTS.scale;
    let resol  = attrs.resol  || this._DEFAULTS.resolution;
    if (this.forced_type)
      type = this.forced_type;

    // Translate rotation: radiants to sin/cos
    let rot = [Math.sin(angle), 1.0];
    trans[0] = trans[0] * this.scale[0];
    trans[1] = trans[1] * this.scale[1];
    scale[0] = scale[0] * this.scale[0];
    scale[1] = scale[1] * this.scale[1];

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.idBufferVertices);
    this.gl.vertexAttribPointer(this.program.vertexPositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4f(this.ids.color, ...color);
    this.gl.uniform2f(this.ids.trans, trans[0], trans[1]);
    this.gl.uniform2f(this.ids.rot, rot[0], rot[1]);
    this.gl.uniform2f(this.ids.scale, scale[0], scale[1]);
    this.gl.uniform2f(this.ids.resolution, resol[0], resol[1]);

    this.gl.drawArrays(type, 0, model.vertices.length/2 >> 0);
    // this.gl.drawArrays(this.gl.LINES, 0, model.vertices.length/2 >> 0);
  },
};
