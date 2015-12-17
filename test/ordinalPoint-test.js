var tape = require("tape"),
    scale = require("../");

// tape("ordinal.rangePoints() computes discrete points in a continuous range", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120]).range(), [0, 60, 120]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 1).range(), [20, 60, 100]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 2).range(), [30, 60, 90]);
//   test.end();
// });

// tape("ordinal.rangePoints() correctly handles empty domains", function(test) {
//   var s = scale.ordinal().domain([]).rangePoints([0, 120]);
//   test.deepEqual(s.range(), []);
//   test.equal(s("b"), undefined);
//   test.deepEqual(s.domain(), []);
//   test.end();
// });

// tape("ordinal.rangePoints() correctly handles singleton domains", function(test) {
//   var s = scale.ordinal().domain(["a"]).rangePoints([0, 120]);
//   test.deepEqual(s.range(), [60]);
//   test.equal(s("b"), undefined);
//   test.deepEqual(s.domain(), ["a"]);
//   test.end();
// });

// tape("ordinal.rangePoints() can be set to a descending range", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0]).range(), [120, 60, 0]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 1).range(), [100, 60, 20]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 2).range(), [90, 60, 30]);
//   test.end();
// });

// tape("ordinal.rangePoints() has a rangeBand of zero", function(test) {
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 1).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 120], 2).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a"]).rangePoints([0, 120]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 1).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangePoints([120, 0], 2).rangeBand(), 0);
//   test.end();
// });

// tape("ordinal.rangePoints() returns undefined for values outside the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 1]);
//   test.equal(s("d"), undefined);
//   test.equal(s("e"), undefined);
//   test.equal(s("f"), undefined);
//   test.end();
// });

// tape("ordinal.rangePoints() does not implicitly add values to the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangePoints([0, 1]);
//   s("d");
//   s("e");
//   test.deepEqual(s.domain(), ["a", "b", "c"]);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() computes discrete points in a continuous range", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120]).range(), [0, 60, 120]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120], 1).range(), [20, 60, 100]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 120], 2).range(), [30, 60, 90]);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() rounds to the nearest equispaced integer values", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119]).range(), [1, 60, 119]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 1).range(), [21, 60, 99]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 2).range(), [31, 60, 89]);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() correctly handles empty domains", function(test) {
//   var s = scale.ordinal().domain([]).rangeRoundPoints([0, 119]);
//   test.deepEqual(s.range(), []);
//   test.equal(s("b"), undefined);
//   test.deepEqual(s.domain(), []);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() correctly handles singleton domains", function(test) {
//   var s = scale.ordinal().domain(["a"]).rangeRoundPoints([0, 119]);
//   test.deepEqual(s.range(), [60]);
//   test.equal(s("b"), undefined);
//   test.deepEqual(s.domain(), ["a"]);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() can be set to a descending range", function(test) {
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0]).range(), [119, 60, 1]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 1).range(), [99, 60, 21]);
//   test.deepEqual(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 2).range(), [89, 60, 31]);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() has a rangeBand of zero", function(test) {
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 1).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 119], 2).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a"]).rangeRoundPoints([0, 119]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0]).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 1).rangeBand(), 0);
//   test.equal(scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([119, 0], 2).rangeBand(), 0);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() returns undefined for values outside the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 1]);
//   test.equal(s("d"), undefined);
//   test.equal(s("e"), undefined);
//   test.equal(s("f"), undefined);
//   test.end();
// });

// tape("ordinal.rangeRoundPoints() does not implicitly add values to the domain", function(test) {
//   var s = scale.ordinal().domain(["a", "b", "c"]).rangeRoundPoints([0, 1]);
//   s("d");
//   s("e");
//   test.deepEqual(s.domain(), ["a", "b", "c"]);
//   test.end();
// });
