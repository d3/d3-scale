var tape = require("tape"),
    array = require("d3-array"),
    scale = require("../");

require("./inDelta");

tape("quantize() has the expected defaults", function(test) {
  var s = scale.quantize();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s(.25), 0);
  test.equal(s(.75), 1);
  test.end();
});

tape("quantize() maps a number to a discrete value in the range", function(test) {
  var s = scale.quantize().range([0, 1, 2]);
  test.equal(s(0), 0);
  test.equal(s(.2), 0);
  test.equal(s(.4), 1);
  test.equal(s(.6), 1);
  test.equal(s(.8), 2);
  test.equal(s(1), 2);
  test.end();
});

tape("quantize() clamps input values to the domain", function(test) {
  var a = {},
      b = {},
      c = {},
      s = scale.quantize().range([a, b, c]);
  test.equal(s(-.5), a);
  test.equal(s(1.5), c);
  test.end();
});

tape("quantize.domain() coerces domain values to numbers", function(test) {
  var s = scale.quantize().domain(["0", "100"]);
  test.deepEqual(s.domain(), [0, 100]);
  test.end();
});

tape("quantize.domain() only considers the extent of the domain", function(test) {
  var s = scale.quantize().domain([-1, 0, 100]);
  test.deepEqual(s.domain(), [-1, 100]);
  test.end();
});

tape("quantize.range() cardinality determines the degree of quantization", function(test) {
  var s = scale.quantize();
  test.inDelta(s.range(array.range(0, 1.001, .001))(1/3), .333, 1e-6);
  test.inDelta(s.range(array.range(0, 1.01, .01))(1/3), .33, 1e-6);
  test.inDelta(s.range(array.range(0, 1.1, .1))(1/3), .3, 1e-6);
  test.inDelta(s.range(array.range(0, 1.2, .2))(1/3), .4, 1e-6);
  test.inDelta(s.range(array.range(0, 1.25, .25))(1/3), .25, 1e-6);
  test.inDelta(s.range(array.range(0, 1.5, .5))(1/3), .5, 1e-6);
  test.inDelta(s.range(array.range(1))(1/3), 0, 1e-6);
  test.end();
});

tape("quantize.range() values are arbitrary", function(test) {
  var a = {},
      b = {},
      c = {},
      s = scale.quantize().range([a, b, c]);
  test.equal(s(0), a);
  test.equal(s(.2), a);
  test.equal(s(.4), b);
  test.equal(s(.6), b);
  test.equal(s(.8), c);
  test.equal(s(1), c);
  test.end();
});

tape("quantize.invertExtent() maps a value in the range to a domain extent", function(test) {
  var s = scale.quantize().range([0, 1, 2, 3]);
  test.deepEqual(s.invertExtent(0), [0, .25]);
  test.deepEqual(s.invertExtent(1), [.25, .5]);
  test.deepEqual(s.invertExtent(2), [.5, .75]);
  test.deepEqual(s.invertExtent(3), [.75, 1]);
  test.end();
});

tape("quantize.invertExtent() allows arbitrary range values", function(test) {
  var a = {},
      b = {},
      s = scale.quantize().range([a, b]);
  test.deepEqual(s.invertExtent(a), [0, .5]);
  test.deepEqual(s.invertExtent(b), [.5, 1]);
  test.end();
});

tape("quantize.invertExtent() returns [NaN, NaN] when the given value is not in the range", function(test) {
  var s = scale.quantize();
  test.ok(s.invertExtent(-1).every(isNaN));
  test.ok(s.invertExtent(.5).every(isNaN));
  test.ok(s.invertExtent(2).every(isNaN));
  test.ok(s.invertExtent('a').every(isNaN));
  test.end();
});

tape("quantize.invertExtent() returns the first match if duplicate values exist in the range", function(test) {
  var s = scale.quantize().range([0, 1, 2, 0]);
  test.deepEqual(s.invertExtent(0), [0, .25]);
  test.deepEqual(s.invertExtent(1), [.25, .5]);
  test.end();
});
