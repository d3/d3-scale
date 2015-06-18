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

tape("linear.nice() is an alias for linear.nice(10)", function(test) {
  test.deepEqual(d3.scale.linear().domain([0, .96]).nice().domain(), [0, 1]);
  test.deepEqual(d3.scale.linear().domain([0, 96]).nice().domain(), [0, 100]);
  test.end();
});

tape("linear.nice(count) extends the domain to match the desired ticks", function(test) {
  test.deepEqual(d3.scale.linear().domain([0, .96]).nice(10).domain(), [0, 1]);
  test.deepEqual(d3.scale.linear().domain([0, 96]).nice(10).domain(), [0, 100]);
  test.deepEqual(d3.scale.linear().domain([.96, 0]).nice(10).domain(), [1, 0]);
  test.deepEqual(d3.scale.linear().domain([96, 0]).nice(10).domain(), [100, 0]);
  test.deepEqual(d3.scale.linear().domain([0, -.96]).nice(10).domain(), [0, -1]);
  test.deepEqual(d3.scale.linear().domain([0, -96]).nice(10).domain(), [0, -100]);
  test.deepEqual(d3.scale.linear().domain([-.96, 0]).nice(10).domain(), [-1, 0]);
  test.deepEqual(d3.scale.linear().domain([-96, 0]).nice(10).domain(), [-100, 0]);
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

tape("linear.tickFormat() is an alias for linear.tickFormat(10)", function(test) {
  test.equal(d3.scale.linear().tickFormat()(0.2), "0.2");
  test.equal(d3.scale.linear().domain([-100, 100]).tickFormat()(-20), "-20");
  test.end();
});

tape("linear.tickFormat(count) returns a format suitable for the ticks", function(test) {
  test.equal(d3.scale.linear().tickFormat(10)(0.2), "0.2");
  test.equal(d3.scale.linear().tickFormat(20)(0.2), "0.20");
  test.equal(d3.scale.linear().domain([-100, 100]).tickFormat(10)(-20), "-20");
  test.end();
});

tape("linear.tickFormat(count, specifier) sets the appropriate fixed precision if not specified", function(test) {
  test.equal(d3.scale.linear().tickFormat(10, "+f")(0.2), "+0.2");
  test.equal(d3.scale.linear().tickFormat(20, "+f")(0.2), "+0.20");
  test.equal(d3.scale.linear().tickFormat(10, "+%")(0.2), "+20%");
  test.equal(d3.scale.linear().domain([0.19, 0.21]).tickFormat(10, "+%")(0.2), "+20.0%");
  test.end();
});

tape("linear.tickFormat(count, specifier) sets the appropriate round precision if not specified", function(test) {
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(10, "")(2.10), "2");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "")(2.01), "2");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "")(2.11), "2.1");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(10, "e")(2.10), "2e+0");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "e")(2.01), "2.0e+0");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "e")(2.11), "2.1e+0");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(10, "g")(2.10), "2");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "g")(2.01), "2.0");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "g")(2.11), "2.1");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(10, "r")(2.10e6), "2000000");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "r")(2.01e6), "2000000");
  test.equal(d3.scale.linear().domain([0, 9]).tickFormat(100, "r")(2.11e6), "2100000");
  test.equal(d3.scale.linear().domain([0, .9]).tickFormat(10, "p")(.210), "20%");
  test.equal(d3.scale.linear().domain([.19, .21]).tickFormat(10, "p")(.201), "20.1%");
  test.end();
});

tape("linear.tickFormat(count, specifier) sets the appropriate prefix precision if not specified", function(test) {
  test.equal(d3.scale.linear().domain([0, 1e6]).tickFormat(10, "$s")(0.51e6), "$0.5M");
  test.equal(d3.scale.linear().domain([0, 1e6]).tickFormat(100, "$s")(0.501e6), "$0.50M");
  test.end();
});
