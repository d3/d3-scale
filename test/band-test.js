var tape = require("tape"),
    scale = require("../");

require("./inDelta");

// tape("ordinal.rangeBands() computes discrete bands in a continuous range", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 120]);
//   test.deepEqual(s.range(), [0, 40, 80]);
//   test.equal(s.rangeBand(), 40);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 120], .2);
//   test.deepEqual(s.range(), [7.5, 45, 82.5]);
//   test.equal(s.rangeBand(), 30);
//   test.end();
// });

// tape("ordinal.rangeBands() setting domain recomputes range bands", function(test) {
//   var s = scale.ordinal().rangeRoundBands([0, 100]).domain(["a", "b", "c"]);
//   test.deepEqual(s.range(), [1, 34, 67]);
//   test.equal(s.rangeBand(), 33);
//   s.domain(["a", "b", "c", "d"]);
//   test.deepEqual(s.range(), [0, 25, 50, 75]);
//   test.equal(s.rangeBand(), 25);
//   test.end();
// });

// tape("ordinal.rangeBands() can be set to a descending range", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0]);
//   test.deepEqual(s.range(), [80, 40, 0]);
//   test.equal(s.rangeBand(), 40);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2);
//   test.deepEqual(s.range(), [82.5, 45, 7.5]);
//   test.equal(s.rangeBand(), 30);
//   test.end();
// });

// tape("ordinal.rangeBands() can specify a different outer padding", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2, .1);
//   test.deepEqual(s.range(), [84, 44, 4]);
//   test.equal(s.rangeBand(), 32);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([120, 0], .2, 1);
//   test.deepEqual(s.range(), [75, 50, 25]);
//   test.equal(s.rangeBand(), 20);
//   test.end();
// });

// tape("ordinal.rangeBands() returns undefined for values outside the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 1]);
//   test.equal(s("d"), undefined);
//   test.equal(s("e"), undefined);
//   test.equal(s("f"), undefined);
//   test.end();
// });

// tape("ordinal.rangeBands() does not implicitly add values to the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeBands([0, 1]);
//   s("d");
//   s("e");
//   test.deepEqual(s.domain(), ["a", "b", "c"]);
//   test.end();
// });

// tape("ordinal.rangeRoundBands() computes discrete rounded bands in a continuous range", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100]);
//   test.deepEqual(s.range(), [1, 34, 67]);
//   test.equal(s.rangeBand(), 33);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100], .2);
//   test.deepEqual(s.range(), [7, 38, 69]);
//   test.equal(s.rangeBand(), 25);
//   test.end();
// });

// tape("ordinal.rangeRoundBands() can be set to a descending range", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([100, 0]);
//   test.deepEqual(s.range(), [67, 34, 1]);
//   test.equal(s.rangeBand(), 33);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([100, 0], .2);
//   test.deepEqual(s.range(), [69, 38, 7]);
//   test.equal(s.rangeBand(), 25);
//   test.end();
// });

// tape("ordinal.rangeRoundBands() can specify a different outer padding", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([120, 0], .2, .1);
//   test.deepEqual(s.range(), [84, 44, 4]);
//   test.equal(s.rangeBand(), 32);
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([120, 0], .2, 1);
//   test.deepEqual(s.range(), [75, 50, 25]);
//   test.equal(s.rangeBand(), 20);
//   test.end();
// });

// tape("ordinal.rangeRoundBands() returns undefined for values outside the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 1]);
//   test.equal(s("d"), undefined);
//   test.equal(s("e"), undefined);
//   test.equal(s("f"), undefined);
//   test.end();
// });

// tape("ordinal.rangeRoundBands() does not implicitly add values to the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 1]);
//   s("d");
//   s("e");
//   test.deepEqual(s.domain(), ["a", "b", "c"]);
//   test.end();
// });

// tape("ordinal.rangeExtent() returns the continuous range", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([20, 120]).rangeExtent(), [20, 120]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeBands([10, 110]).rangeExtent(), [10, 110]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundBands([0, 100]).rangeExtent(), [0, 100]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).range([0, 20, 100]).rangeExtent(), [0, 100]);
//   test.end();
// });

// tape("ordinal.rangeExtent() can handle descending ranges", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeBands([100, 0]).rangeExtent(), [0, 100]);
//   test.end();
// });

// tape("ordinal.copy() changes to the domain are isolated", function(test) {
//   var s1 = scale.ordinal().range(["foo", "bar"]),
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

// tape("ordinal.copy() changes to the range type are isolated", function(test) {
//   var s1 = scale.ordinal().domain([0, 1]).rangeBands([0, 1], .2),
//       s2 = s1.copy();
//   s1.rangePoints([1, 2]);
//   test.inDelta(s1(0), 1, 1e-6);
//   test.inDelta(s1(1), 2, 1e-6);
//   test.inDelta(s1.rangeBand(), 0, 1e-6);
//   test.inDelta(s2(0), 1/11, 1e-6);
//   test.inDelta(s2(1), 6/11, 1e-6);
//   test.inDelta(s2.rangeBand(), 4/11, 1e-6);
//   s2.rangeBands([0, 1]);
//   test.inDelta(s1(0), 1, 1e-6);
//   test.inDelta(s1(1), 2, 1e-6);
//   test.inDelta(s1.rangeBand(), 0, 1e-6);
//   test.inDelta(s2(0), 0, 1e-6);
//   test.inDelta(s2(1), 1/2, 1e-6);
//   test.inDelta(s2.rangeBand(), 1/2, 1e-6);
//   test.end();
// });

