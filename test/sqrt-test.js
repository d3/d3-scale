var tape = require("tape"),
    scale = require("../");

require("./inDelta");

tape("scaleSqrt() has the expected defaults", function(test) {
  var s = scale.scaleSqrt();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.exponent(), 0.5);
  test.deepEqual(s.interpolate()({array: ["red"]}, {array: ["blue"]})(0.5), {array: ["rgb(128, 0, 128)"]});
  test.end();
});

tape("sqrt(x) maps a domain value x to a range value y", function(test) {
  test.equal(scale.scaleSqrt()(0.5), Math.SQRT1_2);
  test.end();
});
