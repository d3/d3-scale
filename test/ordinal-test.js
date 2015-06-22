var tape = require("tape"),
    scale = require("../");

tape("ordinal() has the expected defaults", function(test) {
  var s = scale.ordinal();
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), []);
  test.equal(s(0), undefined);
  test.end();
});

tape("ordinal(x) maps a unique name x in the domain to the corresponding value y in the range", function(test) {
  var s = scale.ordinal().domain([0, 1]).range(["foo", "bar"]);
  test.equal(s(0), "foo");
  test.equal(s(1), "bar");
  var s = scale.ordinal().range(["a", "b", "c"]);
  test.equal(s(0), "a");
  test.equal(s("0"), "a");
  test.equal(s([0]), "a");
  test.equal(s(1), "b");
  test.equal(s(2.0), "c");
  test.equal(s(new Number(2)), "c");
  test.end();
});

tape("ordinal(x) implicitly extends the domain when a range is explicitly specified", function(test) {
  var s = scale.ordinal().range(["foo", "bar"]);
  test.deepEqual(s.domain(), []);
  test.equal(s(0), "foo");
  test.deepEqual(s.domain(), [0]);
  test.equal(s(1), "bar");
  test.deepEqual(s.domain(), [0, 1]);
  test.equal(s(0), "foo");
  test.deepEqual(s.domain(), [0, 1]);
  test.end();
});

tape("ordinal.domain() replaces previous domain values", function(test) {
  var s = scale.ordinal().range(["foo", "bar"]);
  test.equal(s(1), "foo");
  test.equal(s(0), "bar");
  test.deepEqual(s.domain(), [1, 0]);
  s.domain(["0", "1"]);
  test.equal(s(0), "foo"); // it changed!
  test.equal(s(1), "bar");
  test.deepEqual(s.domain(), ["0", "1"]);
  test.end();
});

tape("ordinal.domain() uniqueness is based on string coercion", function(test) {
  var s = scale.ordinal().domain(["foo"]).range([42, 43, 44]);
  test.equal(s(new String("foo")), 42);
  test.equal(s({toString: function() { return "foo"; }}), 42);
  test.equal(s({toString: function() { return "bar"; }}), 43);
  test.end();
});

tape("ordinal.domain() does not coerce domain values to strings", function(test) {
  var s = scale.ordinal().domain([0, 1]);
  test.deepEqual(s.domain(), [0, 1]);
  test.equal(typeof s.domain()[0], "number");
  test.equal(typeof s.domain()[1], "number");
  test.end();
});

tape("ordinal.domain() does not barf on object built-ins", function(test) {
  var s = scale.ordinal().domain(["__proto__", "hasOwnProperty"]).range([42, 43]);
  test.equal(s("__proto__"), 42);
  test.equal(s("hasOwnProperty"), 43);
  test.deepEqual(s.domain(), ["__proto__", "hasOwnProperty"]);
  test.end();
});

tape("ordinal.domain() is ordered by appearance", function(test) {
  var s = scale.ordinal();
  s("foo");
  s("bar");
  s("baz");
  test.deepEqual(s.domain(), ["foo", "bar", "baz"]);
  s.domain(["baz", "bar"]);
  s("foo");
  test.deepEqual(s.domain(), ["baz", "bar", "foo"]);
  s.domain(["baz", "foo"]);
  test.deepEqual(s.domain(), ["baz", "foo"]);
  s.domain([]);
  s("foo");
  s("bar");
  test.deepEqual(s.domain(), ["foo", "bar"]);
  test.end();
});

tape("ordinal.range() setting the range remembers previous values", function(test) {
  var s = scale.ordinal();
  test.equal(s(0), undefined);
  test.equal(s(1), undefined);
  s.range(["foo", "bar"]);
  test.equal(s(0), "foo");
  test.equal(s(1), "bar");
  test.end();
});

tape("ordinal.range() recycles values when exhausted", function(test) {
  var s = scale.ordinal().range(["a", "b", "c"]);
  test.equal(s(0), "a");
  test.equal(s(1), "b");
  test.equal(s(2), "c");
  test.equal(s(3), "a");
  test.equal(s(4), "b");
  test.equal(s(5), "c");
  test.equal(s(2), "c");
  test.equal(s(1), "b");
  test.equal(s(0), "a");
  test.end();
});

tape("ordinal.rangePoints() computes discrete points in a continuous range", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120]).range(), [0, 60, 120]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 1).range(), [20, 60, 100]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 2).range(), [30, 60, 90]);
  test.end();
});

tape("ordinal.rangePoints() correctly handles empty domains", function(test) {
  var s = scale.ordinal().domain([]).rangePoints([0, 120]);
  test.deepEqual(s.range(), []);
  test.equal(s("b"), undefined);
  test.deepEqual(s.domain(), []);
  test.end();
});

tape("ordinal.rangePoints() correctly handles singleton domains", function(test) {
  var s = scale.ordinal().domain(["a"]).rangePoints([0, 120]);
  test.deepEqual(s.range(), [60]);
  test.equal(s("b"), undefined);
  test.deepEqual(s.domain(), ["a"]);
  test.end();
});

tape("ordinal.rangePoints() can be set to a descending range", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0]).range(), [120, 60, 0]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 1).range(), [100, 60, 20]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 2).range(), [90, 60, 30]);
  test.end();
});

tape("ordinal.rangePoints() has a rangeBand of zero", function(test) {
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 1).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 2).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a"]).rangePoints([0, 120]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 1).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 2).rangeBand(), 0);
  test.end();
});

tape("ordinal.rangePoints() returns undefined for values outside the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 1]);
  test.equal(s("d"), undefined);
  test.equal(s("e"), undefined);
  test.equal(s("f"), undefined);
  test.end();
});

tape("ordinal.rangePoints() does not implicitly add values to the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 1]);
  s("d");
  s("e");
  test.deepEqual(s.domain(), ["a", "b", "c"]);
  test.end();
});

tape("ordinal.rangeRoundPoints() computes discrete points in a continuous range", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120]).range(), [0, 60, 120]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120], 1).range(), [20, 60, 100]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120], 2).range(), [30, 60, 90]);
  test.end();
});

tape("ordinal.rangeRoundPoints() rounds to the nearest equispaced integer values", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119]).range(), [1, 60, 119]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 1).range(), [21, 60, 99]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 2).range(), [31, 60, 89]);
  test.end();
});

tape("ordinal.rangeRoundPoints() correctly handles empty domains", function(test) {
  var s = scale.ordinal().domain([]).rangeRoundPoints([0, 119]);
  test.deepEqual(s.range(), []);
  test.equal(s("b"), undefined);
  test.deepEqual(s.domain(), []);
  test.end();
});

tape("ordinal.rangeRoundPoints() correctly handles singleton domains", function(test) {
  var s = scale.ordinal().domain(["a"]).rangeRoundPoints([0, 119]);
  test.deepEqual(s.range(), [60]);
  test.equal(s("b"), undefined);
  test.deepEqual(s.domain(), ["a"]);
  test.end();
});

tape("ordinal.rangeRoundPoints() can be set to a descending range", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0]).range(), [119, 60, 1]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 1).range(), [99, 60, 21]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 2).range(), [89, 60, 31]);
  test.end();
});

tape("ordinal.rangeRoundPoints() has a rangeBand of zero", function(test) {
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 1).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 2).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a"]).rangeRoundPoints([0, 119]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0]).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 1).rangeBand(), 0);
  test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 2).rangeBand(), 0);
  test.end();
});

tape("ordinal.rangeRoundPoints() returns undefined for values outside the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 1]);
  test.equal(s("d"), undefined);
  test.equal(s("e"), undefined);
  test.equal(s("f"), undefined);
  test.end();
});

tape("ordinal.rangeRoundPoints() does not implicitly add values to the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 1]);
  s("d");
  s("e");
  test.deepEqual(s.domain(), ["a", "b", "c"]);
  test.end();
});

tape("ordinal.rangeBands() computes discrete bands in a continuous range", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 120]);
  test.deepEqual(s.range(), [0, 40, 80]);
  test.equal(s.rangeBand(), 40);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 120], .2);
  test.deepEqual(s.range(), [7.5, 45, 82.5]);
  test.equal(s.rangeBand(), 30);
  test.end();
});

tape("ordinal.rangeBands() setting domain recomputes range bands", function(test) {
  var s = scale.ordinal().rangeRoundBands([0, 100]).domain(["a", "b", "c"]);
  test.deepEqual(s.range(), [1, 34, 67]);
  test.equal(s.rangeBand(), 33);
  s.domain(["a", "b", "c", "d"]);
  test.deepEqual(s.range(), [0, 25, 50, 75]);
  test.equal(s.rangeBand(), 25);
  test.end();
});

tape("ordinal.rangeBands() can be set to a descending range", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0]);
  test.deepEqual(s.range(), [80, 40, 0]);
  test.equal(s.rangeBand(), 40);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2);
  test.deepEqual(s.range(), [82.5, 45, 7.5]);
  test.equal(s.rangeBand(), 30);
  test.end();
});

tape("ordinal.rangeBands() can specify a different outer padding", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2, .1);
  test.deepEqual(s.range(), [84, 44, 4]);
  test.equal(s.rangeBand(), 32);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2, 1);
  test.deepEqual(s.range(), [75, 50, 25]);
  test.equal(s.rangeBand(), 20);
  test.end();
});

tape("ordinal.rangeBands() returns undefined for values outside the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 1]);
  test.equal(s("d"), undefined);
  test.equal(s("e"), undefined);
  test.equal(s("f"), undefined);
  test.end();
});

tape("ordinal.rangeBands() does not implicitly add values to the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 1]);
  s("d");
  s("e");
  test.deepEqual(s.domain(), ["a", "b", "c"]);
  test.end();
});

tape("ordinal.rangeRoundBands() computes discrete rounded bands in a continuous range", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100]);
  test.deepEqual(s.range(), [1, 34, 67]);
  test.equal(s.rangeBand(), 33);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100], .2);
  test.deepEqual(s.range(), [7, 38, 69]);
  test.equal(s.rangeBand(), 25);
  test.end();
});

tape("ordinal.rangeRoundBands() can be set to a descending range", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([100, 0]);
  test.deepEqual(s.range(), [67, 34, 1]);
  test.equal(s.rangeBand(), 33);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([100, 0], .2);
  test.deepEqual(s.range(), [69, 38, 7]);
  test.equal(s.rangeBand(), 25);
  test.end();
});

tape("ordinal.rangeRoundBands() can specify a different outer padding", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([120, 0], .2, .1);
  test.deepEqual(s.range(), [84, 44, 4]);
  test.equal(s.rangeBand(), 32);
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([120, 0], .2, 1);
  test.deepEqual(s.range(), [75, 50, 25]);
  test.equal(s.rangeBand(), 20);
  test.end();
});

tape("ordinal.rangeRoundBands() returns undefined for values outside the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 1]);
  test.equal(s("d"), undefined);
  test.equal(s("e"), undefined);
  test.equal(s("f"), undefined);
  test.end();
});

tape("ordinal.rangeRoundBands() does not implicitly add values to the domain", function(test) {
  var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 1]);
  s("d");
  s("e");
  test.deepEqual(s.domain(), ["a", "b", "c"]);
  test.end();
});

tape("ordinal.rangeExtent() returns the continuous range", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([20, 120]).rangeExtent(), [20, 120]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeBands([10, 110]).rangeExtent(), [10, 110]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100]).rangeExtent(), [0, 100]);
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).range([0, 20, 100]).rangeExtent(), [0, 100]);
  test.end();
});

tape("ordinal.rangeExtent() can handle descending ranges", function(test) {
  test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeBands([100, 0]).rangeExtent(), [0, 100]);
  test.end();
});

tape("ordinal.copy() changes to the domain are isolated", function(test) {
  var s1 = scale.ordinal().range(["foo", "bar"]),
      s2 = s1.copy();
  s1.domain([1, 2]);
  test.deepEqual(s2.domain(), []);
  test.equal(s1(1), "foo");
  test.equal(s2(1), "foo");
  s2.domain([2, 3]);
  test.equal(s1(2), "bar");
  test.equal(s2(2), "foo");
  test.deepEqual(s1.domain(), [1, 2]);
  test.deepEqual(s2.domain(), [2, 3]);
  test.end();
});

tape("ordinal.copy() changes to the range are isolated", function(test) {
  var s1 = scale.ordinal().range(["foo", "bar"]),
      s2 = s1.copy();
  s1.range(["bar", "foo"]);
  test.equal(s1(1), "bar");
  test.equal(s2(1), "foo");
  test.deepEqual(s2.range(), ["foo", "bar"]);
  s2.range(["foo", "baz"]);
  test.equal(s1(2), "foo");
  test.equal(s2(2), "baz");
  test.deepEqual(s1.range(), ["bar", "foo"]);
  test.deepEqual(s2.range(), ["foo", "baz"]);
  test.end();
});

tape("ordinal.copy() changes to the range type are isolated", function(test) {
  var s1 = scale.ordinal().domain([0, 1]).rangeBands([0, 1], .2),
      s2 = s1.copy();
  s1.rangePoints([1, 2]);
  test.inDelta(s1(0), 1, 1e-6);
  test.inDelta(s1(1), 2, 1e-6);
  test.inDelta(s1.rangeBand(), 0, 1e-6);
  test.inDelta(s2(0), 1/11, 1e-6);
  test.inDelta(s2(1), 6/11, 1e-6);
  test.inDelta(s2.rangeBand(), 4/11, 1e-6);
  s2.rangeBands([0, 1]);
  test.inDelta(s1(0), 1, 1e-6);
  test.inDelta(s1(1), 2, 1e-6);
  test.inDelta(s1.rangeBand(), 0, 1e-6);
  test.inDelta(s2(0), 0, 1e-6);
  test.inDelta(s2(1), 1/2, 1e-6);
  test.inDelta(s2.rangeBand(), 1/2, 1e-6);
  test.end();
});
