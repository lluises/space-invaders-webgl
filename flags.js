// Class Flag

// TODO


function Flag(type) {
  if (this === window)
    return new Flag(type);

  if (type == Flag.RANDOM)
    type = Flag.ALL_FLAGS[Math.random()*Flag.ALL_FLAGS.length - 1e-6 >> 0];

  this.type = type || Flag.RAINBOW;

  return this;
}


Flag.RANDOM = "Tonto el que lo lea";

Flag.RAINBOW = [
  [ [244,   3,   3].map(x => x/255), ],
  [ [255, 140,   0].map(x => x/255), ],
  [ [255, 237,   0].map(x => x/255), ],
  [ [  0, 128,  38].map(x => x/255), ],
  [ [  0,  77, 255].map(x => x/255), ],
  [ [117,   7, 135].map(x => x/255), ],
];

Flag.BISEXUAL = [
  [ [214,   2, 112].map(x => x/255), ],
  [ [214,   2, 112].map(x => x/255), ],
  [ [155,  79, 150].map(x => x/255), ],
  [ [  0,  56, 168].map(x => x/255), ],
  [ [  0,  56, 168].map(x => x/255), ],
];

Flag.LESBIAN = [
  [ [213,  45,   0].map(x => x/255), ],
  [ [255, 154,  86].map(x => x/255), ],
  [ [255, 255, 255].map(x => x/255), ],
  [ [211,  98, 164].map(x => x/255), ],
  [ [163,   2,  98].map(x => x/255), ],
];

Flag.GAY = [
  [ [  7, 142, 112].map(x => x/255), ],
  [ [ 38, 206, 170].map(x => x/255), ],
  [ [152, 232, 193].map(x => x/255), ],
  [ [241, 238, 255].map(x => x/255), ],
  [ [123, 173, 226].map(x => x/255), ],
  [ [ 80,  73, 203].map(x => x/255), ],
  [ [ 61,  26, 120].map(x => x/255), ],
];

Flag.TRANSGENDER = [
  [ [ 91, 206, 250].map(x => x/255), ],
  [ [245, 169, 184].map(x => x/255), ],
  [ [255, 255, 255].map(x => x/255), ],
  [ [245, 169, 184].map(x => x/255), ],
  [ [ 91, 206, 250].map(x => x/255), ],
];

Flag.ASEXUAL = [
  [ [ 44,  44,  44].map(x => x/255), ],
  [ [163, 163, 163].map(x => x/255), ],
  [ [255, 255, 255].map(x => x/255), ],
  [ [128,   0, 128].map(x => x/255), ],
];

Flag.NONBINARY = [
  [ [52, 244,  52].map(x => x/255), ],
  [ [252, 252, 252].map(x => x/255), ],
  [ [156,  89, 209].map(x => x/255), ],
  [ [ 44,  44,  44].map(x => x/255), ],
];

Flag.PANSEXUAL = [
  [ [255,  33, 140].map(x => x/255), ],
  [ [255,  33, 140].map(x => x/255), ],
  [ [255, 216,   0].map(x => x/255), ],
  [ [255, 216,   0].map(x => x/255), ],
  [ [ 33, 177, 255].map(x => x/255), ],
  [ [ 33, 177, 255].map(x => x/255), ],
];

Flag.ALL_FLAGS = [
  Flag.RAINBOW,
  Flag.BISEXUAL,
  Flag.LESBIAN,
  Flag.GAY,
  Flag.TRANSGENDER,
  Flag.ASEXUAL,
  Flag.NONBINARY,
  Flag.PANSEXUAL,
];

Flag.prototype = {
  color(x, y) {
    const row = this._row(y);
    return [...row[x % row.length], 1.0];
  },

  _row(y) {
    // Return the row colors
    return this.type[y % this.type.length];
  },
};
