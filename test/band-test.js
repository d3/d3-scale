var tape = require("tape"),
    scale = require("../");

tape("band() has the expected defaults", function(test) {
  var s = scale.band();
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.band(), 0);
  test.equal(s.step(), 0);
  test.equal(s.round(), false);
  test.equal(s.paddingInner(), 0);
  test.equal(s.paddingOuter(), 0);
  test.equal(s.align(), 0.5);
  test.end();
});

tape("band(value) computes discrete bands in a continuous range", function(test) {
  var s = scale.band().range([0, 960]);
  test.equal(s("foo"), undefined);
  s.domain(["foo", "bar"]);
  test.equal(s("foo"), 0);
  test.equal(s("bar"), 480);
  s.domain(["a", "b", "c"]).range([0, 120]);
  test.deepEqual(s.domain().map(s), [0, 40, 80]);
  test.equal(s.band(), 40);
  s.padding(0.2);
  test.deepEqual(s.domain().map(s), [7.5, 45, 82.5]);
  test.equal(s.band(), 30);
  test.end();
});

tape("band(value) returns undefined for values outside the domain", function(test) {
  var s = scale.band().domain(["a", "b", "c"]);
  test.equal(s("d"), undefined);
  test.equal(s("e"), undefined);
  test.equal(s("f"), undefined);
  test.end();
});

tape("band(value) does not implicitly add values to the domain", function(test) {
  var s = scale.band().domain(["a", "b", "c"]);
  s("d");
  s("e");
  test.deepEqual(s.domain(), ["a", "b", "c"]);
  test.end();
});

tape("band.band() returns the band width", function(test) {
  var s = scale.band().range([0, 960]);
  test.equal(s.domain([]).band(), 960);
  test.equal(s.domain(["foo"]).band(), 960);
  test.equal(s.domain(["foo", "bar"]).band(), 480);
  test.equal(s.domain(["foo", "bar", "baz"]).band(), 320);
  s.padding(0.5);
  test.equal(s.domain([]).band(), 480);
  test.equal(s.domain(["foo"]).band(), 320);
  test.equal(s.domain(["foo", "bar"]).band(), 192);
  test.end();
});

tape("band.domain(values) recomputes the bands", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).rangeRound([0, 100]);
  test.deepEqual(s.domain().map(s), [1, 34, 67]);
  test.equal(s.band(), 33);
  s.domain(["a", "b", "c", "d"]);
  test.deepEqual(s.domain().map(s), [0, 25, 50, 75]);
  test.equal(s.band(), 25);
  test.end();
});

tape("band.domain(x) makes a copy of the domain", function(test) {
  var domain = ["red", "green"],
      s = scale.band().domain(domain);
  domain.push("blue");
  test.deepEqual(s.domain(), ["red", "green"]);
  test.end();
});

tape("band.domain() returns a copy of the domain", function(test) {
  var s = scale.band().domain(["red", "green"]),
      domain = s.domain();
  test.deepEqual(domain, ["red", "green"]);
  domain.push("blue");
  test.deepEqual(s.domain(), ["red", "green"]);
  test.end();
});

tape("band.range(values) can be descending", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).range([120, 0]);
  test.deepEqual(s.domain().map(s), [80, 40, 0]);
  test.equal(s.band(), 40);
  s.padding(0.2);
  test.deepEqual(s.domain().map(s), [82.5, 45, 7.5]);
  test.equal(s.band(), 30);
  test.end();
});

tape("band.range(x) makes a copy of the range", function(test) {
  var range = [1, 2],
      s = scale.band().range(range);
  range.push("blue");
  test.deepEqual(s.range(), [1, 2]);
  test.end();
});

tape("band.range() returns a copy of the range", function(test) {
  var s = scale.band().range([1, 2]),
      range = s.range();
  test.deepEqual(range, [1, 2]);
  range.push("blue");
  test.deepEqual(s.range(), [1, 2]);
  test.end();
});

tape("band.range(values) coerces values[0] and values[1] to a number", function(test) {
  var s = scale.band().range({0: "1.0", 1: "2.0", length: 2});
  test.deepEqual(s.range(), [1, 2]);
  test.end();
});

tape("band.paddingInner(p) specifies the inner padding p", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).range([120, 0]).paddingInner(0.1).round(true);
  test.deepEqual(s.domain().map(s), [83, 42, 1]);
  test.equal(s.band(), 37);
  s.paddingInner(0.2);
  test.deepEqual(s.domain().map(s), [85, 43, 1]);
  test.equal(s.band(), 34);
  test.end();
});

tape("band.paddingInner(p) coerces p to a number in [0, 1]", function(test) {
  var s = scale.band();
  test.equal(s.paddingInner("1.0").paddingInner(), 1);
  test.equal(s.paddingInner("-1.0").paddingInner(), 0);
  test.equal(s.paddingInner("2.0").paddingInner(), 1);
  test.ok(Number.isNaN(s.paddingInner(NaN).paddingInner()));
  test.end();
});

tape("band.paddingOuter(p) specifies the outer padding p", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).range([120, 0]).paddingInner(0.2).paddingOuter(0.1);
  test.deepEqual(s.domain().map(s), [84, 44, 4]);
  test.equal(s.band(), 32);
  s.paddingOuter(1);
  test.deepEqual(s.domain().map(s), [75, 50, 25]);
  test.equal(s.band(), 20);
  test.end();
});

tape("band.paddingOuter(p) coerces p to a number in [0, 1]", function(test) {
  var s = scale.band();
  test.equal(s.paddingOuter("1.0").paddingOuter(), 1);
  test.equal(s.paddingOuter("-1.0").paddingOuter(), 0);
  test.equal(s.paddingOuter("2.0").paddingOuter(), 1);
  test.ok(Number.isNaN(s.paddingOuter(NaN).paddingOuter()));
  test.end();
});

tape("band.rangeRound(values) is an alias for band.range(values).round(true)", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).rangeRound([0, 100]);
  test.deepEqual(s.range(), [0, 100]);
  test.equal(s.round(), true);
  test.end();
});

tape("band.round(true) computes discrete rounded bands in a continuous range", function(test) {
  var s = scale.band().domain(["a", "b", "c"]).range([0, 100]).round(true);
  test.deepEqual(s.domain().map(s), [1, 34, 67]);
  test.equal(s.band(), 33);
  s.padding(0.2);
  test.deepEqual(s.domain().map(s), [7, 38, 69]);
  test.equal(s.band(), 25);
  test.end();
});

tape("band.copy() copies all fields", function(test) {
  var s1 = scale.band().domain(["red", "green"]).range([1, 2]).round(true).paddingInner(0.1).paddingOuter(0.2),
      s2 = s1.copy();
  test.deepEqual(s2.domain(), s1.domain());
  test.deepEqual(s2.range(), s1.range());
  test.equal(s2.round(), s1.round());
  test.equal(s2.paddingInner(), s1.paddingInner());
  test.equal(s2.paddingOuter(), s1.paddingOuter());
  test.end();
});

// tape("band.copy() changes to the domain are isolated", function(test) {
//   var s1 = scale.band().range(["foo", "bar"]),
//       s2 = s1.copy();
//   s1.domain([1, 2]);
//   test.deepEqual(s2.domain(), []);
//   test.equal(s1(1), "foo");
//   test.equal(s2(1), "foo");
//   s2.domain([2, 3]);
//   test.equal(s1(2), "bar");
//   test.equal(s2(2), "foo");
//   test.deepEqual(s1.domain(), [1, 2]);
//   test.deepEqual(s2.domain(), [2, 3]);
//   test.end();
// });

// tape("band.copy() changes to the range type are isolated", function(test) {
//   var s1 = scale.band().domain([0, 1]).range([0, 1], .2),
//       s2 = s1.copy();
//   s1.rangePoints([1, 2]);
//   test.inDelta(s1(0), 1, 1e-6);
//   test.inDelta(s1(1), 2, 1e-6);
//   test.inDelta(s1.band(), 0, 1e-6);
//   test.inDelta(s2(0), 1/11, 1e-6);
//   test.inDelta(s2(1), 6/11, 1e-6);
//   test.inDelta(s2.band(), 4/11, 1e-6);
//   s2.range([0, 1]);
//   test.inDelta(s1(0), 1, 1e-6);
//   test.inDelta(s1(1), 2, 1e-6);
//   test.inDelta(s1.band(), 0, 1e-6);
//   test.inDelta(s2(0), 0, 1e-6);
//   test.inDelta(s2(1), 1/2, 1e-6);
//   test.inDelta(s2.band(), 1/2, 1e-6);
//   test.end();
// });
