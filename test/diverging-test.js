var tape = require("tape"),
    scale = require("../");

tape("scaleDiverging(interpolator) has the expected defaults", function(test) {
  var i = function(t) { return t; },
      s = scale.scaleDiverging(i);
  test.deepEqual(s.domain(), [0, 0.5, 1]);
  test.equal(s.interpolator(), i);
  test.equal(s.clamp(), false);
  test.equal(s(-0.5), -0.5);
  test.equal(s( 0.0),  0.0);
  test.equal(s( 0.5),  0.5);
  test.equal(s( 1.0),  1.0);
  test.equal(s( 1.5),  1.5);
  test.end();
});

tape("diverging.clamp(true) enables clamping", function(test) {
  var s = scale.scaleDiverging(function(t) { return t; }).clamp(true);
  test.equal(s.clamp(), true);
  test.equal(s(-0.5), 0.0);
  test.equal(s( 0.0), 0.0);
  test.equal(s( 0.5), 0.5);
  test.equal(s( 1.0), 1.0);
  test.equal(s( 1.5), 1.0);
  test.end();
});

tape("diverging.domain() coerces domain values to numbers", function(test) {
  var s = scale.scaleDiverging(function(t) { return t; }).domain(["-1.20", " 0", "2.40"]);
  test.deepEqual(s.domain(), [-1.2, 0, 2.4]);
  test.equal(s(-1.2), 0.000);
  test.equal(s( 0.6), 0.625);
  test.equal(s( 2.4), 1.000);
  test.end();
});

tape("diverging.domain() only considers the first three elements of the domain", function(test) {
  var s = scale.scaleDiverging(function(t) { return t; }).domain([-1, 100, 200, 3]);
  test.deepEqual(s.domain(), [-1, 100, 200]);
  test.end();
});

tape("diverging.copy() returns an isolated copy of the scale", function(test) {
  var s1 = scale.scaleDiverging(function(t) { return t; }).domain([1, 2, 3]).clamp(true),
      s2 = s1.copy();
  test.deepEqual(s2.domain(), [1, 2, 3]);
  test.equal(s2.clamp(), true);
  s1.domain([-1, 1, 2]);
  test.deepEqual(s2.domain(), [1, 2, 3]);
  s1.clamp(false);
  test.equal(s2.clamp(), true);
  s2.domain([3, 4, 5]);
  test.deepEqual(s1.domain(), [-1, 1, 2]);
  s2.clamp(true);
  test.deepEqual(s1.clamp(), false);
  test.end();
});

tape("scaleDiverging.interpolator(interpolator) sets the interpolator", function(test) {
  var i0 = function(t) { return t; },
      i1 = function(t) { return t * 2; },
      s = scale.scaleDiverging(i0);
  test.equal(s.interpolator(), i0);
  test.equal(s.interpolator(i1), s);
  test.equal(s.interpolator(), i1);
  test.equal(s(-0.5), -1.0);
  test.equal(s( 0.0),  0.0);
  test.equal(s( 0.5),  1.0);
  test.end();
});
