var tape = require("tape"),
    d3 = require("../");

tape("linear() returns a function", function(test) {
  test.equal(typeof d3.scale.linear(), "function");
  test.end();
});

tape("linear() has the expected defaults", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.domain(), [0, 1]);
  test.deepEqual(s.range(), [0, 1]);
  test.equal(s.clamp(), false);
  test.equal(s.interpolate(), d3.interpolate);
  test.end();
});

tape("linear.ticks(count) returns the expected ticks", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.ticks(10), [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
  test.deepEqual(s.ticks(9),  [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
  test.deepEqual(s.ticks(8),  [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
  test.deepEqual(s.ticks(7),  [0.0,      0.2,      0.4,      0.6,      0.8,      1.0]);
  test.deepEqual(s.ticks(6),  [0.0,      0.2,      0.4,      0.6,      0.8,      1.0]);
  test.deepEqual(s.ticks(5),  [0.0,      0.2,      0.4,      0.6,      0.8,      1.0]);
  test.deepEqual(s.ticks(4),  [0.0,      0.2,      0.4,      0.6,      0.8,      1.0]);
  test.deepEqual(s.ticks(3),  [0.0,                     0.5,                     1.0]);
  test.deepEqual(s.ticks(2),  [0.0,                     0.5,                     1.0]);
  test.deepEqual(s.ticks(1),  [0.0,                                              1.0]);
  s.domain([-100, 100]);
  test.deepEqual(s.ticks(10), [-100, -80, -60,      -40, -20, 0, 20, 40,     60, 80, 100]);
  test.deepEqual(s.ticks(9),  [-100, -80, -60,      -40, -20, 0, 20, 40,     60, 80, 100]);
  test.deepEqual(s.ticks(8),  [-100, -80, -60,      -40, -20, 0, 20, 40,     60, 80, 100]);
  test.deepEqual(s.ticks(7),  [-100, -80, -60,      -40, -20, 0, 20, 40,     60, 80, 100]);
  test.deepEqual(s.ticks(6),  [-100,           -50,           0,         50,         100]);
  test.deepEqual(s.ticks(5),  [-100,           -50,           0,         50,         100]);
  test.deepEqual(s.ticks(4),  [-100,           -50,           0,         50,         100]);
  test.deepEqual(s.ticks(3),  [-100,           -50,           0,         50,         100]);
  test.deepEqual(s.ticks(2),  [-100,                          0,                     100]);
  test.deepEqual(s.ticks(1),  [                               0                         ]);
  test.end();
});

tape("linear.ticks(count) returns the empty array if count is not a positive integer", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.ticks(NaN), []);
  test.deepEqual(s.ticks(0), []);
  test.deepEqual(s.ticks(-1), []);
  test.deepEqual(s.ticks(Infinity), []);
  test.end();
});

tape("linear.ticks() is an alias for linear.ticks(10)", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.ticks(), s.ticks(10));
  test.end();
});

tape("linear.tickFormat(count) returns a format suitable for the ticks", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.domain([0, 1]).ticks(10).map(s.tickFormat(10)), ["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"]);
  test.deepEqual(s.domain([0, 1]).ticks(3).map(s.tickFormat(20)), ["0.00", "0.50", "1.00"]);
  test.deepEqual(s.domain([-100, 100]).ticks(10).map(s.tickFormat(10)), ["-100", "-80", "-60", "-40", "-20", "0", "20", "40", "60", "80", "100"]);
  test.end();
});

tape("linear.tickFormat() is an alias for linear.tickFormat(10)", function(test) {
  var s = d3.scale.linear();
  test.deepEqual(s.domain([0, 1]).ticks().map(s.tickFormat()), ["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"]);
  test.end();
});
