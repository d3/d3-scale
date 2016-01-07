var tape = require("tape"),
    scale = require("../");

tape("scaleRainbow() has the expected defaults", function(test) {
  var s = scale.scaleRainbow();
  test.deepEqual(s.domain(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s(0.0), "#6e40aa");
  test.equal(s(0.5), "#aff05b");
  test.equal(s(1.0), "#6e40aa");
  test.end();
});

tape("rainbow(value) cycles by default", function(test) {
  var s = scale.scaleRainbow();
  for (var i = -2; i < 3; ++i) {
    test.equal(s(i + 0.0), "#6e40aa");
    test.equal(s(i + 0.5), "#aff05b");
    test.equal(s(i + 1.0), "#6e40aa");
  }
  test.end();
});

tape("rainbow.clamp(true) enables clamping", function(test) {
  var s = scale.scaleRainbow().clamp(true);
  test.equal(s.clamp(), true);
  test.equal(s(-0.5), "#6e40aa");
  test.equal(s( 0.0), "#6e40aa");
  test.equal(s( 0.5), "#aff05b");
  test.equal(s( 1.0), "#6e40aa");
  test.equal(s( 1.5), "#6e40aa");
  test.end();
});

tape("rainbow.domain() coerces domain values to numbers", function(test) {
  var s = scale.scaleRainbow().domain(["-1.20", "2.40"]);
  test.deepEqual(s.domain(), [-1.2, 2.4]);
  test.equal(s(-1.2), "#6e40aa");
  test.equal(s( 0.6), "#aff05b");
  test.equal(s( 2.4), "#6e40aa");
  test.end();
});

tape("rainbow.domain() only considers the first and second element of the domain", function(test) {
  var s = scale.scaleRainbow().domain([-1, 100, 200]);
  test.deepEqual(s.domain(), [-1, 100]);
  test.end();
});

tape("rainbow.copy() returns an isolated copy of the scale", function(test) {
  var s1 = scale.scaleRainbow().domain([1, 3]).clamp(true),
      s2 = s1.copy();
  test.deepEqual(s2.domain(), [1, 3]);
  test.equal(s2.clamp(), true);
  s1.domain([-1, 2]);
  test.deepEqual(s2.domain(), [1, 3]);
  s1.clamp(false);
  test.equal(s2.clamp(), true);
  s2.domain([3, 4]);
  test.deepEqual(s1.domain(), [-1, 2]);
  s2.clamp(true);
  test.deepEqual(s1.clamp(), false);
  test.end();
});
