var tape = require("tape"),
    scale = require("../");

tape("scaleViridis() has the expected defaults", function(test) {
  var s = scale.scaleViridis();
  test.deepEqual(s.domain(), [0, 1]);
  test.equal(s(0.0), "#440154");
  test.equal(s(0.5), "#21918c");
  test.equal(s(1.0), "#fde725");
  test.end();
});

tape("viridis(value) always clamps", function(test) {
  var s = scale.scaleViridis();
  test.ok(!("clamp" in s));
  test.equal(s(-0.5), "#440154");
  test.equal(s( 0.0), "#440154");
  test.equal(s( 0.5), "#21918c");
  test.equal(s( 1.0), "#fde725");
  test.equal(s( 1.5), "#fde725");
  test.end();
});

tape("viridis.domain() coerces domain values to numbers", function(test) {
  var s = scale.scaleViridis().domain(["-1.20", "2.40"]);
  test.deepEqual(s.domain(), [-1.2, 2.4]);
  test.equal(s(-1.2), "#440154");
  test.equal(s( 0.6), "#21918c");
  test.equal(s( 2.4), "#fde725");
  test.end();
});

tape("viridis.domain() only considers the first and second element of the domain", function(test) {
  var s = scale.scaleViridis().domain([-1, 100, 200]);
  test.deepEqual(s.domain(), [-1, 100]);
  test.end();
});

tape("viridis.copy() returns an isolated copy of the scale", function(test) {
  var s1 = scale.scaleViridis().domain([1, 3]),
      s2 = s1.copy();
  test.deepEqual(s2.domain(), [1, 3]);
  s1.domain([-1, 2]);
  test.deepEqual(s2.domain(), [1, 3]);
  s2.domain([3, 4]);
  test.deepEqual(s1.domain(), [-1, 2]);
  test.end();
});
