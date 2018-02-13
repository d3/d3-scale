var tape = require("tape"),
    scale = require("../");

tape("scaleCompound() requires arguments", function(test) {
  test.equal(scale.scaleCompound(), null);
  test.end();
});

tape("compound.domain() doesn't accept arguments", function(test) {
  var x = scale.scaleCompound(scale.scaleLinear());
  test.throws(function () { x.domain([1, 0]); });
  test.end();
});

tape("compound.range() doesn't accept arguments", function(test) {
  var x = scale.scaleCompound(scale.scaleLinear());
  test.throws(function () { x.domain([1, 0]); });
  test.end();
});

tape("compound.domain() returns inclusive domain", function(test) {
  var x = scale.scaleCompound(scale.scaleLinear().domain([0, 10]), scale.scaleLinear().domain([8, 20]));
  test.deepEquals(x.domain(), [0, 20]);
  test.end();
});

tape("compound.range() returns inclusive range", function(test) {
  var x = scale.scaleCompound(scale.scaleLinear().range([0, 10]), scale.scaleLinear().range([8, 20]));
  test.deepEquals(x.range(), [0, 20]);
  test.end();
});

tape("compound() prefers first scale on bounds", function(test) {
  var linear = scale.scaleLinear().domain([0, 10]);
  var log = scale.scaleLog().domain([8, 20]);
  var x = scale.scaleCompound(linear, log);
  test.equal(x(0), linear(0));
  test.equal(x(8), linear(8));
  test.equal(x(10), linear(10));
  test.end();
});

tape("compound() delegates to second scale out of bounds of first", function(test) {
  var linear = scale.scaleLinear().domain([0, 10]);
  var log = scale.scaleLog().domain([8, 20]);
  var x = scale.scaleCompound(linear, log);
  test.equal(x(11), log(11));
  test.equal(x(20), log(20));
  test.end();
});

tape("compound() returns last scale when all out of bounds", function(test) {
  var linear = scale.scaleLinear().domain([0, 10]);
  var log = scale.scaleLog().domain([8, 20]);
  var x = scale.scaleCompound(linear, log);
  test.equal(x(21), log(21));
  test.equal(x(200), log(200));
  test.ok(isNaN(x(-1)));
  test.ok(isNaN(x(-100)));
  test.end();
});
