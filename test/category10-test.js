var tape = require("tape"),
    scale = require("../");

tape("scaleCategory10() is an ordinal scale", function(test) {
  var s = scale.scaleCategory10();
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
  test.equal(s(0), "#1f77b4");
  test.equal(s(1), "#ff7f0e");
  test.equal(s(0), "#1f77b4");
  for (var i = 0; i < 10; ++i) s(i);
  for (var i = 0; i < 10; ++i) test.equal(s(i + 10), s(i));
  s.domain([]);
  test.equal(s(0), "#1f77b4");
  test.equal(s(1), "#ff7f0e");
  test.end();
});

tape("scaleCategory10() returns an isolated instance", function(test) {
  var s1 = scale.scaleCategory10(),
      s2 = scale.scaleCategory10();
  test.equal(s1(1), "#1f77b4");
  test.equal(s2(2), "#1f77b4");
  test.equal(s2(1), "#ff7f0e");
  test.equal(s1(1), "#1f77b4");
  test.end();
});
