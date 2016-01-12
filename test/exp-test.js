var tape = require("tape"),
    scale = require("../");

require("./inDelta");

tape("scaleExp() has the expected defaults", function(test) {
  var s = scale.scaleExp();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [1, Math.E]);
  test.equal(s.clamp(), false);
  test.equal(s.base(), Math.E);
  test.end();
});

tape("exp(x) maps a domain value x to a range value y", function(test) {
  var s = scale.scaleExp();
  test.equal(s(0), 1);
  test.equal(s(1), Math.E);
  test.equal(s(2), Math.E * Math.E);

  s.domain([0, 2]).range([1, 100]);
  test.equal(s(0), 1);
  test.equal(s(1), 10);
  test.equal(s(2), 100);

  test.end();
});

tape("exp(x) maps an empty domain to the range start", function(test) {
  test.equal(scale.scaleExp().domain([0, 0]).range([1, 2])(0), 1);
  test.equal(scale.scaleExp().domain([0, 0]).range([2, 1])(1), 2);
  test.end();
});

tape("exp.invert(y) maps a range value y to a domain value x", function(test) {
  var s = scale.scaleExp();
  test.inDelta(s.invert(1), 0);
  test.inDelta(s.invert(Math.E), 1);
  test.inDelta(s.invert(Math.E*Math.E), 2);

  s.base(10);
  test.inDelta(s.invert(0.01), -2);
  test.inDelta(s.invert(1), 0);
  test.inDelta(s.invert(100), 2);
  test.end();
});
