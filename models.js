window.MODELS = {
  _cache_data: {},
  _cache(key, value) {
    // If key in cache, returns key, otherwise, returns null
    if (value === undefined)
      return window.MODELS._cache_data[key] || null;
    window.MODELS._cache_data[key] = value;
    return value;
  },

  Circle(resolution) {
    let cached = this._cache("Circle"+resolution);
    if (cached)
      return cached;

    resolution = resolution || 32;
    let res = [];
    for (let i = 0; i <= resolution; i++) {
      const a = 2 * Math.PI * i / resolution;
      const x = Math.cos(a);
      const y = Math.sin(a);
      const a2 = 2 * Math.PI * (i+1) / resolution;
      const x2 = Math.cos(a2);
      const y2 = Math.sin(a2);
      res.push(x, y, x2, y2, 0, 0);
    }
    return this._cache("Circle"+resolution, res);
  },

  Oval(resolution, rx, ry) {
    let cached = this._cache(`Oval${resolution}:${rx}:${ry}`);
    if (cached)
      return cached;

    resolution = resolution || 32;
    let res = [];
    for (let i = 0; i <= resolution; i++) {
      const a = 2 * Math.PI * i / resolution;
      const x = Math.cos(a)/ry;
      const y = Math.sin(a)/rx;
      const a2 = 2 * Math.PI * (i+1) / resolution;
      const x2 = Math.cos(a2)/ry;
      const y2 = Math.sin(a2)/rx;
      res.push(x, y, x2, y2, 0, 0);
    }
    return this._cache(`$Oval${resolution}:${rx}:${ry}`, res);
  },

  Play1() {
    return [
      -1, -1,
       1,  0,
      -1,  1,
    ];
  },

  Spaceship1() {
    let cached = this._cache("Spaceship1");
    if (cached)
      return cached;

    const pixel_size = 1/6; // To normalize points

    let res = [
      // Body
      -5.5, -1,
       5.5, -1,
      -5.5,  4,
      -5.5,  4,
       5.5, -1,
       5.5,  4,

      // Motor (left)
      -6.5,  0,
      -5.5,  0,
      -6.5,  4,
      -6.5,  4,
      -5.5,  0,
      -5.5,  4,

      // Motor (right)
       6.5,  0,
       5.5,  0,
       6.5,  4,
       6.5,  4,
       5.5,  0,
       5.5,  4,

      // Neck
      -1.5, -3,
       1.5, -3,
      -1.5, -1,
      -1.5, -1,
       1.5, -3,
       1.5, -1,

      // Tip
      -0.5, -4,
       0.5, -4,
      -0.5, -3,
      -0.5, -3,
       0.5, -4,
       0.5, -3,
    ].map(v => v*pixel_size);

    return this._cache("Spaceship1", res);
  },

  Enemy1() {
    let cached = this._cache("Enemy1");
    if (cached)
      return cached;

    const pixel_size = 1/6; // To normalize points
    let res = [
      // Body upper
      -1.5, -2,
       1.5, -2,
      -1.5,  0,
      -1.5,  0,
       1.5, -2,
       1.5,  0,

      // Body bottom
      -3.5,  0,
       3.5,  0,
      -3.5,  2,
       3.5,  0,
       3.5,  2,
      -3.5,  2,

      // Upper eyes (right)
      -2.5, -3,
      -1.5, -3,
      -2.5, -1,
      -1.5, -3,
      -1.5, -1,
      -2.5, -1,

      // Upper eyes (left)
       2.5, -3,
       1.5, -3,
       2.5, -1,
       1.5, -3,
       1.5, -1,
       2.5, -1,

      // Antena (right)
      -3.5, -4,
      -2.5, -4,
      -3.5, -3,
      -3.5, -3,
      -2.5, -4,
      -2.5, -3,

      // Antena (left)
       3.5, -4,
       2.5, -4,
       3.5, -3,
       3.5, -3,
       2.5, -4,
       2.5, -3,

      // Between arm and eye (right)
      -3.5, -2,
      -2.5, -2,
      -3.5, -0,
      -2.5, -2,
      -2.5, -0,
      -3.5, -0,

      // Between arm and eye (left)
       3.5, -2,
       2.5, -2,
       3.5, -0,
       2.5, -2,
       2.5, -0,
       3.5, -0,

      // Arm near body (right)
      -4.5, -1,
      -3.5, -1,
      -4.5,  1,
      -3.5, -1,
      -3.5,  1,
      -4.5,  1,

      // Arm near body (left)
      -4.5, -1,
      -3.5, -1,
      -4.5,  1,
      -3.5, -1,
      -3.5,  1,
      -4.5,  1,

      // Arm near body (right)
       4.5, -1,
       3.5, -1,
       4.5,  1,
       3.5, -1,
       3.5,  1,
       4.5,  1,

      // Arm final extremity (left)
      -5.5,  0,
      -4.5,  0,
      -5.5,  3,
      -4.5,  0,
      -4.5,  3,
      -5.5,  3,

      // Arm final extremity (right)
       5.5,  0,
       4.5,  0,
       5.5,  3,
       4.5,  0,
       4.5,  3,
       5.5,  3,

      // Mouth holder (left)
      -3.5,  2,
      -2.5,  2,
      -3.5,  3,
      -2.5,  2,
      -2.5,  3,
      -3.5,  3,

      // Mouth holder (right)
       3.5,  2,
       2.5,  2,
       3.5,  3,
       2.5,  2,
       2.5,  3,
       3.5,  3,

      // Mouth (left)
      -2.5,  3,
      -0.5,  3,
      -2.5,  4,
      -0.5,  3,
      -0.5,  4,
      -2.5,  4,

      // Mouth (right)
       2.5,  3,
       0.5,  3,
       2.5,  4,
       0.5,  3,
       0.5,  4,
       2.5,  4,
    ].map(v => v*pixel_size);

    return this._cache("Enemy1", res);
  },

  Spaceship2_base() {
    let cached = this._cache("Spaceship2_base");
    if (cached)
      return cached;

    const pixel_size = 1/13; // To normalize points
    let res = [
      // Head
       -4,  -6,
       -2, -13,
        4,  -6,
        4,  -6,
       -2, -13,
        2, -13,

      // Body
      -13,   5,
       -4,  -6,
        4,  -6,
      -13,   5,
        4,  -6,
       13,   5,

      // Bottom body (left)
      -13,   5,
      -12,   8,
      -13,   7,
      -13,   5,
      -12,   8,
       13,   5,

      // Bottom body (right)
       13,   5,
       12,   8,
       13,   7,
       13,   5,
       12,   8,
      -12,   8,

      // Motor zone
       -4,   8,
       -2,  10,
        4,   8,
        4,   8,
        2,  10,
       -2,  10,
    ].map(v => v*pixel_size);

    return this._cache("Spaceship2_base", res);
  },

  Spaceship2_glass() {
    let cached = this._cache("Spaceship2_glass");
    if (cached)
      return cached;

    const pixel_size = 1/4; // To normalize points
    let res = [
      // Left
      -2,  1,
      -2, -3,
       0, -4,
       0,  0,
      -2,  1,
       0, -4,

      // Right
       2,  1,
       2, -3,
       0, -4,
       0,  0,
       2,  1,
       0, -4,
    ];

    return this._cache("Spaceship2_glass", res);
  },

  Spaceship2_head_and_motor() {
    let cached = this._cache("Spaceship2_head_and_motor");
    if (cached)
      return cached;

    const pixel_size = 1/15; // To normalize points
    let res = [
      // Head
      -2, -13,
      -1, -15,
       1, -15,
       1, -15,
       2, -13,
       1, -12,
       1, -12,
      -2, -13,
      -1, -12,
      -2, -13,
       1, -15,
       1, -12,

      // Motor (left)
      -2,  11,
      -1,  10,
      -2,   8,
      -2,   8,
       1,   7,
      -1,   7,
      -2,   8,
       1,   7,
      -1,  10,

      // Motor (right)
       2,  11,
       1,  10,
       2,   8,
       2,   8,
       1,   7,
       1,  10,
      -2,  10,
       1,   7,
       1,  10,
    ];

    return this._cache("Spaceship2_head_and_motor", res);
  },
};
