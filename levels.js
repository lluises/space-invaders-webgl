// Class Level


function Level(start) {
  if (this === window)
    return new Level(start);

  this._num = start || 1;

  for (const [key, value] of Object.entries(this._get_properties()))
    this[key] = value;

  return this;
}

Level.prototype = {
  _configs: [
    // Level 1
    () => {
      const _ = 0;
      const X = 1;
      return {
        enemy_matrix: [
          [_, _, _, X, X, _, _, _],
          [_, _, X, X, X, X, _, _],
          [_, X, X, X, X, X, X, _],
          [X, X, _, X, X, _, X, X],
          [X, X, X, X, X, X, X, X],
          [_, _, X, _, _, X, _, _],
          [_, X, _, X, X, _, X, _],
          [X, _, X, _, _, X, _, X],
        ],
        enemy_shot_probability: 0.1,
        enemy_shot_probability_max: 100,
        enemy_speed: 0.001,
        enemy_speed_gain: 0.0005,
        enemy_margin: {top: 0.05, x: 0.03, y: 0.03},
        flag: new Flag(Flag.RAINBOW),
      };
    },

    // Level 2
    () => {
      const _ = 0;
      const X = 1;
      return {
        enemy_matrix: [
          [_, _, X, _, _, _, _, _, X, _, _],
          [_, _, _, X, _, _, _, X, _, _, _],
          [_, _, X, X, X, X, X, X, X, _, _],
          [_, X, X, _, X, X, X, _, X, X, _],
          [X, X, X, X, X, X, X, X, X, X, X],
          [X, _, X, X, X, X, X, X, X, _, X],
          [X, _, X, _, _, _, _, _, X, _, X],
          [_, _, _, X, X, _, X, X, _, _, _],
        ],
        enemy_shot_probability: 0.1,
        enemy_shot_probability_max: 100,
        enemy_speed: 0.001,
        enemy_speed_gain: 0.0005,
        enemy_margin: {top: 0.05, x: 0.03, y: 0.03},
        flag: new Flag(Flag.BISEXUAL),
      };
    },

    // Level 3
    () => {
      const _ = 0;
      const X = 1;
      return {
        enemy_matrix: [
          [_, _, _, _, X, X, X, X, _, _, _, _],
          [_, X, X, X, X, X, X, X, X, X, X, _],
          [X, X, X, X, X, X, X, X, X, X, X, X],
          [X, X, X, _, _, X, X, _, _, X, X, X],
          [X, X, X, X, X, X, X, X, X, X, X, X],
          [_, _, _, X, X, _, _, X, X, _, _, _],
          [_, _, X, X, _, X, X, _, X, X, _, _],
          [X, X, _, _, _, _, _, _, _, _, X, X],
        ],
        enemy_shot_probability: 0.1,
        enemy_shot_probability_max: 80,
        enemy_speed: 0.001,
        enemy_speed_gain: 0.0003,
        enemy_margin: {top: 0.05, x: 0.03, y: 0.03},
        flag: new Flag(Flag.LESBIAN),
      };
    },

    // Level 4
    () => {
      const _ = 0;
      const X = 1;
      return {
        enemy_matrix: [
          [_, _, _, _, _, X, X, X, X, X, X, _, _, _, _, _],
          [_, _, _, X, X, X, X, X, X, X, X, X, X, _, _, _],
          [_, _, X, X, X, X, X, X, X, X, X, X, X, X, _, _],
          [_, X, X, _, X, X, _, X, X, _, X, X, _, X, X, _],
          [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
          [_, _, X, X, X, _, _, X, X, _, _, X, X, X, _, _],
          [_, _, _, X, _, _, _, _, _, _, _, _, X, _, _, _],
        ],
        enemy_shot_probability: 0.15,
        enemy_shot_probability_max: 70,
        enemy_speed: 0.001,
        enemy_speed_gain: 0.0002,
        enemy_margin: {top: 0.05, x: 0.03, y: 0.03},
        flag: new Flag(Flag.TRANSGENDER),
      };
    },

  ],

  _extra: [
    () => {
      const _ = 0;
      const X = 1;
      return {
        enemy_matrix: [
          [_, _, X, _, _, _, _, _, X, _, _],
          [_, _, _, X, _, _, _, X, _, _, _],
          [_, _, X, X, X, X, X, X, X, _, _],
          [_, X, X, _, X, X, X, _, X, X, _],
          [X, X, X, X, X, X, X, X, X, X, X],
          [X, _, X, X, X, X, X, X, X, _, X],
          [X, _, X, _, _, _, _, _, X, _, X],
          [_, _, _, X, X, _, X, X, _, _, _],
        ],
        enemy_shot_probability: 0.1,
        enemy_shot_probability_max: 100,
        enemy_speed: 0.001,
        enemy_speed_gain: 0.0005,
        enemy_margin: {top: 0.05, x: 0.03, y: 0.03},
        flag: new Flag(Flag.RANDOM),
      };
    },
  ],

  next() {
    // Return next level
    return new Level(this._num + 1);
  },

  previous() {
    // Return previous level or null if this is the first one
    if (this._num <= 1)
      return null;
    return new Level(this._num - 1);
  },

  _get_properties() {
    if (this._num - 1 < this._configs.length)
      return this._configs[this._num - 1]();
    return this._extra[this._num % this._extra.length]();
  },

  get number() {
    return this._num;
  },
};
