var tape = require("tape"),
    scale = require("../");

tape("sequentialQuantile() clamps", function(test) {
  var s = scale.scaleSequentialQuantile().domain([0, 1, 2, 3, 10]);
  test.equal(s(-1), 0);
  test.equal(s(0), 0);
  test.equal(s(1), 0.25);
  test.equal(s(10), 1);
  test.equal(s(20), 1);
  test.end();
});

tape("sequentialQuantile().domain() sorts the domain", function(test) {
  var s = scale.scaleSequentialQuantile().domain([0, 2, 9, 0.1, 10]);
  test.deepEqual(s.domain(), [0, 0.1, 2, 9, 10]);
  test.end();
});

tape("sequentialQuantile().range() returns the computed range", function(test) {
  var s = scale.scaleSequentialQuantile().domain([0, 2, 9, 0.1, 10]);
  test.deepEqual(s.range(), [0 / 4, 1 / 4, 2 / 4, 3 / 4, 4 / 4]);
  test.end();
});
