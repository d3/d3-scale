var tape = require("tape"),
    scale = require("../");

require("./inDelta");

tape("scaleSymlog() has the expected defaults", function(test) {
  var s = scale.scaleSymlog();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.constant(), 1);
  test.end();
});

tape("symlog(x) maps a domain value x to a range value y", function(test) {
  var s = scale.scaleSymlog().domain([-100, 100]);
  test.equal(s(-100), 0);
  test.equal(s(100), 1);
  test.equal(s(0), 0.5);
  test.end();
});

tape("symlog.invert(y) maps a range value y to a domain value x", function(test) {
  var s = scale.scaleSymlog().domain([-100, 100]);
  test.inDelta(s.invert(1), 100);
  test.end();
});

tape("symlog.invert(y) coerces range values to numbers", function(test) {
  var s = scale.scaleSymlog().range(["-3", "3"]);
  test.deepEqual(s.invert(3), 1);
  test.end();
});

tape("symlog.invert(y) returns NaN if the range is not coercible to number", function(test) {
  test.ok(isNaN(scale.scaleSymlog().range(["#000", "#fff"]).invert("#999")));
  test.ok(isNaN(scale.scaleSymlog().range([0, "#fff"]).invert("#999")));
  test.end();
});

tape("symlog.constant(constant) sets the constant to the specified value", function(test) {
  var s = scale.scaleSymlog().constant(5);
  test.equal(s.constant(), 5);
  test.end();
});

tape("symlog.constant(constant) changing the constant does not change the domain or range", function(test) {
  var s = scale.scaleSymlog().constant(2);
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.end();
});

tape("symlog.domain(domain) accepts an array of numbers", function(test) {
  test.deepEqual(scale.scaleSymlog().domain([]).domain(), []);
  test.deepEqual(scale.scaleSymlog().domain([1, 0]).domain(), [1, 0]);
  test.deepEqual(scale.scaleSymlog().domain([1, 2, 3]).domain(), [1, 2, 3]);
  test.end();
});

tape("symlog.domain(domain) coerces domain values to numbers", function(test) {
  test.deepEqual(scale.scaleSymlog().domain([new Date(1990, 0, 1), new Date(1991, 0, 1)]).domain(), [631180800000, 662716800000]);
  test.deepEqual(scale.scaleSymlog().domain(["0.0", "1.0"]).domain(), [0, 1]);
  test.deepEqual(scale.scaleSymlog().domain([new Number(0), new Number(1)]).domain(), [0, 1]);
  test.end();
});

tape("symlog.domain(domain) makes a copy of domain values", function(test) {
  var d = [1, 2], s = scale.scaleSymlog().domain(d);
  test.deepEqual(s.domain(), [1, 2]);
  d.push(3);
  test.deepEqual(s.domain(), [1, 2]);
  test.deepEqual(d, [1, 2, 3]);
  test.end();
});

tape("symlog.domain() returns a copy of domain values", function(test) {
  var s = scale.scaleSymlog(), d = s.domain();
  test.deepEqual(d, [0, 1]);
  d.push(3);
  test.deepEqual(s.domain(), [0, 1]);
  test.end();
});

tape("symlog.range(range) does not coerce range to numbers", function(test) {
  var s = scale.scaleSymlog().range(["0px", "2px"]);
  test.deepEqual(s.range(), ["0px", "2px"]);
  test.equal(s(1), "2px");
  test.end();
});

tape("symlog.range(range) can accept range values as arrays or objects", function(test) {
  test.deepEqual(scale.scaleSymlog().range([{color: "red"}, {color: "blue"}])(1), {color: "rgb(0, 0, 255)"});
  test.deepEqual(scale.scaleSymlog().range([["red"], ["blue"]])(0), ["rgb(255, 0, 0)"]);
  test.end();
});

tape("symlog.range(range) makes a copy of range values", function(test) {
  var r = [1, 2], s = scale.scaleSymlog().range(r);
  test.deepEqual(s.range(), [1, 2]);
  r.push(3);
  test.deepEqual(s.range(), [1, 2]);
  test.deepEqual(r, [1, 2, 3]);
  test.end();
});

tape("symlog.range() returns a copy of range values", function(test) {
  var s = scale.scaleSymlog(), r = s.range();
  test.deepEqual(r, [0, 1]);
  r.push(3);
  test.deepEqual(s.range(), [0, 1]);
  test.end();
});

tape("symlog.clamp() is false by default", function(test) {
  test.equal(scale.scaleSymlog().clamp(), false);
  test.equal(scale.scaleSymlog().range([10, 20])(3), 30);
  test.equal(scale.scaleSymlog().range([10, 20])(-1), 0);
  test.equal(scale.scaleSymlog().range([10, 20]).invert(30), 3);
  test.equal(scale.scaleSymlog().range([10, 20]).invert(0), -1);
  test.end();
});

tape("symlog.clamp(true) restricts output values to the range", function(test) {
  test.equal(scale.scaleSymlog().clamp(true).range([10, 20])(2), 20);
  test.equal(scale.scaleSymlog().clamp(true).range([10, 20])(-1), 10);
  test.end();
});

tape("symlog.clamp(true) restricts input values to the domain", function(test) {
  test.equal(scale.scaleSymlog().clamp(true).range([10, 20]).invert(30), 1);
  test.equal(scale.scaleSymlog().clamp(true).range([10, 20]).invert(0), 0);
  test.end();
});

tape("symlog.clamp(clamp) coerces the specified clamp value to a boolean", function(test) {
  test.equal(scale.scaleSymlog().clamp("true").clamp(), true);
  test.equal(scale.scaleSymlog().clamp(1).clamp(), true);
  test.equal(scale.scaleSymlog().clamp("").clamp(), false);
  test.equal(scale.scaleSymlog().clamp(0).clamp(), false);
  test.end();
});

tape("symlog.copy() returns a copy with changes to the domain are isolated", function(test) {
  var x = scale.scaleSymlog(), y = x.copy();
  x.domain([1, 2]);
  test.deepEqual(y.domain(), [0, 1]);
  test.equal(x(1), 0);
  test.equal(y(1), 1);
  y.domain([2, 3]);
  test.equal(x(2), 1);
  test.equal(y(2), 0);
  test.deepEqual(x.domain(), [1, 2]);
  test.deepEqual(y.domain(), [2, 3]);
  y = x.domain([1, 1.9]).copy();
  x.nice(5);
  test.deepEqual(x.domain(), [1, 2]);
  test.deepEqual(y.domain(), [1, 1.9]);
  test.end();
});

tape("symlog.copy() returns a copy with changes to the range are isolated", function(test) {
  var x = scale.scaleSymlog(), y = x.copy();
  x.range([1, 2]);
  test.equal(x.invert(1), 0);
  test.equal(y.invert(1), 1);
  test.deepEqual(y.range(), [0, 1]);
  y.range([2, 3]);
  test.equal(x.invert(2), 1);
  test.equal(y.invert(2), 0);
  test.deepEqual(x.range(), [1, 2]);
  test.deepEqual(y.range(), [2, 3]);
  test.end();
});

tape("symlog.copy() returns a copy with changes to clamping are isolated", function(test) {
  var x = scale.scaleSymlog().clamp(true), y = x.copy();
  x.clamp(false);
  test.equal(x(3), 2);
  test.equal(y(2), 1);
  test.equal(y.clamp(), true);
  y.clamp(false);
  test.equal(x(3), 2);
  test.equal(y(3), 2);
  test.equal(x.clamp(), false);
  test.end();
});

tape("symlog().clamp(true).invert(x) cannot return a value outside the domain", function(test) {
  var x = scale.scaleSymlog().domain([1, 20]).clamp(true);
  test.equal(x.invert(0), 1);
  test.equal(x.invert(1), 20);
  test.end();
});

