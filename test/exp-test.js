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

  s = s.base(10);
  s = s.domain([0, 5]).range([1e0, 1e5]);
  test.equal(s(0), 1e0);
  test.equal(s(1), 1e1);
  test.equal(s(2), 1e2);
  test.equal(s(3), 1e3);
  test.equal(s(4), 1e4);
  test.equal(s(5), 1e5);

  s = s.domain([0, 5]).range([1e5, 1e10]);
  test.equal(s(0), 1e5);
  test.equal(s(1), 1e6);
  test.equal(s(2), 1e7);
  test.equal(s(3), 1e8);
  test.equal(s(4), 1e9);
  test.equal(s(5), 1e10);

  s = s.domain([5, 10]).range([1e2, 1e7]);
  test.equal(s(5), 1e2);
  test.equal(s(6), 1e3);
  test.equal(s(7), 1e4);
  test.equal(s(8), 1e5);
  test.equal(s(9), 1e6);
  test.equal(s(10), 1e7);

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
