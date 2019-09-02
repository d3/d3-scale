var tape = require("tape"),
    scale = require("../");

tape("scaleRadial() has the expected defaults", function(test) {
  var s = scale.scaleRadial();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.round(), false);
  test.end();
});

tape("scaleRadial(range) sets the range", function(test) {
  var s = scale.scaleRadial([100, 200]);
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [100, 200]);
  test.equal(s(0.5), 158.11388300841898);
  test.end();
});

tape("scaleRadial(domain, range) sets the range", function(test) {
  var s = scale.scaleRadial([1, 2], [10, 20]);
  test.deepEqual(s.domain(), [1, 2]);
  test.deepEqual(s.range(), [10, 20]);
  test.equal(s(1.5), 15.811388300841896);
  test.end();
});

tape("radial(x) maps a domain value x to a range value y", function(test) {
  test.equal(scale.scaleRadial([1, 2])(0.5), 1.5811388300841898);
  test.end();
});

tape("radial(x) ignores extra range values if the domain is smaller than the range", function(test) {
  test.equal(scale.scaleRadial().domain([-10, 0]).range([2, 3, 4]).clamp(true)(-5), 2.5495097567963922);
  test.equal(scale.scaleRadial().domain([-10, 0]).range([2, 3, 4]).clamp(true)(50), 3);
  test.end();
});

tape("radial(x) ignores extra domain values if the range is smaller than the domain", function(test) {
  test.equal(scale.scaleRadial().domain([-10, 0, 100]).range([2, 3]).clamp(true)(-5), 2.5495097567963922);
  test.equal(scale.scaleRadial().domain([-10, 0, 100]).range([2, 3]).clamp(true)(50), 3);
  test.end();
});

tape("radial(x) maps an empty domain to the middle of the range", function(test) {
  test.equal(scale.scaleRadial().domain([0, 0]).range([1, 2])(0), 1.5811388300841898);
  test.equal(scale.scaleRadial().domain([0, 0]).range([2, 1])(1), 1.5811388300841898);
  test.end();
});

tape("radial(x) can map a bilinear domain with two values to the corresponding range", function(test) {
  var s = scale.scaleRadial().domain([1, 2]);
  test.deepEqual(s.domain(), [1, 2]);
  test.equal(s(0.5), -0.7071067811865476);
  test.equal(s(1.0),  0.0);
  test.equal(s(1.5),  0.7071067811865476);
  test.equal(s(2.0),  1.0);
  test.equal(s(2.5),  1.224744871391589);
  test.equal(s.invert(-0.5), 0.75);
  test.equal(s.invert( 0.0), 1.0);
  test.equal(s.invert( 0.5), 1.25);
  test.equal(s.invert( 1.0), 2.0);
  test.equal(s.invert( 1.5), 3.25);
  test.end();
});

tape("radial(NaN) returns undefined", function(test) {
  var s = scale.scaleRadial();
  test.strictEqual(s(NaN), undefined);
  test.strictEqual(s(undefined), undefined);
  test.strictEqual(s("foo"), undefined);
  test.strictEqual(s({}), undefined);
  test.end();
});

tape("radial.unknown(unknown)(NaN) returns the specified unknown value", function(test) {
  test.strictEqual(scale.scaleRadial().unknown("foo")(NaN), "foo");
  test.end();
});

tape("radial(x) can handle a negative range", function(test) {
  test.equal(scale.scaleRadial([-1, -2])(0.5), -1.5811388300841898);
  test.end();
});

tape("radial(x) can clamp negative values", function(test) {
  test.equal(scale.scaleRadial([-1, -2]).clamp(true)(-0.5), -1);
  test.equal(scale.scaleRadial().clamp(true)(-0.5), 0);
  test.equal(scale.scaleRadial([-0.25, 0], [1, 2]).clamp(true)(-0.5), 1);
  test.end();
});
