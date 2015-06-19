var tape = require("tape"),
    scale = require("../");

tape("log() has the expected defaults", function(test) {
  var s = scale.log();
  test.deepEqual(s.domain(), [1, 10]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.base(), 10);
  test.deepEqual(s.interpolate()({array: ["red"]}, {array: ["blue"]})(.5), {array: ["#800080"]});
  test.end();
});
