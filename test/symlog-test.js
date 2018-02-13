var tape = require("tape"),
    scale = require("../");

function assertScaleValue(test, scale1, scale2, value) {
  var expected = scale2(value);
  test.equal(scale1(value), expected);
  test.true(isFinite(expected));
}

tape("scaleSymlog() maps domain [-1, 1] to linear scale", function(test) {
  var linear = scale.scaleLinear().domain([-1, 1]).range([10, 0]);
  var symlog = scale.scaleSymlog().domain([-1, 1]).range([10, 0]);

  var scales = symlog.scales();
  test.equal(scales.length, 1);

  // Linear range 0 - 1
  test.equal(symlog(-1), linear(-1));
  test.equal(symlog(-0.75), linear(-0.75));
  test.equal(symlog(-0.5), linear(-0.5));
  test.equal(symlog(-0.25), linear(-0.25));
  test.equal(symlog(0), linear(0));
  test.equal(symlog(0.25), linear(0.25));
  test.equal(symlog(0.5), linear(0.5));
  test.equal(symlog(0.75), linear(0.75));
  test.equal(symlog(1), linear(1));

  test.end();
});

tape("scaleSymlog() maps domain [1, 10] to logarithm scale", function(test) {
  var log = scale.scaleLog().domain([1, 10]).range([1, 10]);
  var symlog = scale.scaleSymlog().domain([1, 10]).range([1, 10]);

  var scales = symlog.scales();
  test.equal(scales.length, 1);

  // Log range 1 - 10
  test.equal(symlog(1), log(1));
  test.equal(symlog(2), log(2));
  test.equal(symlog(5), log(5));
  test.equal(symlog(10), log(10));
  test.end();
});

tape("scaleSymlog() maps domain [-1, -10] to logarithm scale", function(test) {
  var log = scale.scaleLog().domain([-1, -10]).range([-1, -10]);
  var symlog = scale.scaleSymlog().domain([-1, -10]).range([-1, -10]);

  var scales = symlog.scales();
  test.equal(scales.length, 1);

  // Log range 1 - 10
  test.equal(symlog(-1), log(-1));
  test.equal(symlog(-2), log(-2));
  test.equal(symlog(-5), log(-5));
  test.equal(symlog(-10), log(-10));
  test.end();
});

tape("scaleSymlog() maps domain [-2, 2] to two logarithm and one linear scales", function(test) {
  var symlog = scale.scaleSymlog().domain([-2, 2]).range([0, 1]);
  var scales = symlog.scales();

  test.equal(scales.length, 3);
  test.deepEqual(scales[0].domain(), [-2, -1]);
  test.deepEqual(scales[1].domain(), [-1, 1]);
  test.deepEqual(scales[2].domain(), [1, 2]);
  test.deepEqual(scales[0].range(), [0, 0.25]);
  test.deepEqual(scales[1].range(), [0.25, 0.75]);
  test.deepEqual(scales[2].range(), [0.75, 1.0]);

  assertScaleValue(test, symlog, scales[0], -2);
  assertScaleValue(test, symlog, scales[0], -1.5);
  assertScaleValue(test, symlog, scales[0], -1);
  assertScaleValue(test, symlog, scales[1], -1);
  assertScaleValue(test, symlog, scales[1], -0.5);
  assertScaleValue(test, symlog, scales[1], 0);
  assertScaleValue(test, symlog, scales[1], 0.5);
  assertScaleValue(test, symlog, scales[1], 1);
  assertScaleValue(test, symlog, scales[2], 1);
  assertScaleValue(test, symlog, scales[2], 1.5);
  assertScaleValue(test, symlog, scales[2], 2);

  test.end();
});

tape("scaleSymlog() maps domain [-10, 10] to two logarithm and one linear scales", function(test) {
  var symlog = scale.scaleSymlog().domain([-10, 10]).range([0, 1]);
  var scales = symlog.scales();

  test.equal(scales.length, 3);
  test.deepEqual(scales[0].domain(), [-10, -1]);
  test.deepEqual(scales[1].domain(), [-1, 1]);
  test.deepEqual(scales[2].domain(), [1, 10]);
  test.deepEqual(scales[0].range(), [0, 0.38431089342012037]);
  test.deepEqual(scales[1].range(), [0.38431089342012037, 0.6156891065798795]);
  test.deepEqual(scales[2].range(), [0.6156891065798795, 1]);

  assertScaleValue(test, symlog, scales[0], -10);
  assertScaleValue(test, symlog, scales[0], -1);
  assertScaleValue(test, symlog, scales[1], -1);
  assertScaleValue(test, symlog, scales[1], -0.5);
  assertScaleValue(test, symlog, scales[1], 0);
  assertScaleValue(test, symlog, scales[1], 0.5);
  assertScaleValue(test, symlog, scales[1], 1);
  assertScaleValue(test, symlog, scales[2], 2);
  assertScaleValue(test, symlog, scales[2], 5);
  assertScaleValue(test, symlog, scales[2], 10);

  test.end();
});

tape("scaleSymlog() maps domain [-1, 2]", function(test) {
  var symlog = scale.scaleSymlog().domain([-1, 2]).range([0, 1]);
  var scales = symlog.scales();

  test.equal(scales.length, 2);
  test.deepEqual(scales[0].domain(), [-1, 1]);
  test.deepEqual(scales[1].domain(), [1, 2]);
  test.deepEqual(scales[0].range(), [0, 2 / 3]);
  test.deepEqual(scales[1].range(), [2 / 3, 1]);

  assertScaleValue(test, symlog, scales[0], -1);

  test.end();
});
