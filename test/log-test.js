var tape = require("tape"),
    scale = require("../");

tape("log() has the expected defaults", function(test) {
  var s = scale.log();
  test.deepEqual(s.domain(), [1, 10]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.base(), 10);
  test.deepEqual(s.interpolate()({array: ["red"]}, {array: ["blue"]})(.5), {array: ["#800080"]});
  test.end();
});

tape("log.ticks() generates the expected power-of-ten ticks", function(test) {
  var s = scale.log();
  test.deepEqual(s.domain([1e-1, 1e1]).ticks().map(round), [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  test.deepEqual(s.domain([1e-1, 1e0]).ticks().map(round), [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  test.deepEqual(s.domain([1e0, 1e-1]).ticks().map(round), [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  test.deepEqual(s.domain([-1e-1, -1e1]).ticks().map(round), [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1]);
  test.deepEqual(s.domain([-1e-1, -1e0]).ticks().map(round), [-1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1]);
  test.deepEqual(s.domain([-1e0, -1e-1]).ticks().map(round), [-1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1]);
  test.end();
});

tape("log.base(base).ticks() generates the expected power-of-base ticks", function(test) {
  var s = scale.log().base(Math.E);
  test.deepEqual(s.domain([0.1, 100]).ticks().map(round), [0.135335283237, 0.367879441171, 1, 2.718281828459, 7.389056098931, 20.085536923188, 54.598150033144]);
  test.end();
});

tape("log.tickFormat() returns the \".0e\" format", function(test) {
  var s = scale.log();
  test.deepEqual(s.domain([1e-1, 1e1]).ticks().map(s.tickFormat()), ["1e-1", "2e-1", "3e-1", "4e-1", "5e-1", "6e-1", "7e-1", "8e-1", "9e-1", "1e+0", "2e+0", "3e+0", "4e+0", "5e+0", "6e+0", "7e+0", "8e+0", "9e+0", "1e+1"]);
  test.end();
});

tape("log.tickFormat(count) returns a filtered \".0e\" format", function(test) {
  var s = scale.log(), t = s.domain([1e-1, 1e1]).ticks();
  test.deepEqual(t.map(s.tickFormat(10)), ["1e-1", "2e-1", "3e-1", "4e-1", "5e-1",     "",     "",     "",     "", "1e+0", "2e+0", "3e+0", "4e+0", "5e+0",     "",     "",     "",     "", "1e+1"]);
  test.deepEqual(t.map(s.tickFormat(5)),  ["1e-1", "2e-1",     "",     "",     "",     "",     "",     "",     "", "1e+0", "2e+0",     "",     "",     "",     "",     "",     "",     "", "1e+1"]);
  test.deepEqual(t.map(s.tickFormat(1)),  ["1e-1",     "",     "",     "",     "",     "",     "",     "",     "", "1e+0",     "",     "",     "",     "",     "",     "",     "",     "", "1e+1"]);
  test.deepEqual(t.map(s.tickFormat(0)),  ["1e-1",     "",     "",     "",     "",     "",     "",     "",     "", "1e+0",     "",     "",     "",     "",     "",     "",     "",     "", "1e+1"]);
  test.end();
});

tape("log.tickFormat(count, format) returns the specified format, filtered", function(test) {
  var s = scale.log(), t = s.domain([1e-1, 1e1]).ticks();
  test.deepEqual(t.map(s.tickFormat(10, "+")), ["+0.1", "+0.2", "+0.3", "+0.4", "+0.5", "", "", "", "", "+1", "+2", "+3", "+4", "+5", "", "", "", "", "+10"]);
  test.end();
});

tape("log.base(base).tickFormat() returns the \",\" format", function(test) {
  var s = scale.log().base(Math.E);
  test.deepEqual(s.domain([1e-1, 1e1]).ticks().map(s.tickFormat()), ["0.135335283237", "0.367879441171", "1", "2.71828182846", "7.38905609893"]);
  test.end();
});

tape("log.base(base).tickFormat(count) returns a filtered \",\" format", function(test) {
  var s = scale.log().base(16), t = s.domain([1e-1, 1e1]).ticks();
  test.deepEqual(t.map(s.tickFormat(10)), ["0.125", "0.1875", "0.25", "0.3125", "0.375", "", "", "", "", "", "", "", "", "", "1", "2", "3", "4", "5", "6", "", "", "", ""]);
  test.deepEqual(t.map(s.tickFormat(5)), ["0.125", "0.1875", "", "", "", "", "", "", "", "", "", "", "", "", "1", "2", "3", "", "", "", "", "", "", ""]);
  test.deepEqual(t.map(s.tickFormat(1)), ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "1", "", "", "", "", "", "", "", "", ""]);
  test.end();
});

function round(x) {
  return Math.round(x * 1e12) / 1e12;
}
