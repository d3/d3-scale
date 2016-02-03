var tape = require("tape"),
    scale = require("../");

tape("scaleCategory20() is an ordinal scale", function(test) {
  var s = scale.scaleCategory20(), i;
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);
  test.equal(s(0), "#1f77b4");
  test.equal(s(1), "#aec7e8");
  test.equal(s(0), "#1f77b4");
  for (i = 0; i < 20; ++i) s(i);
  for (i = 0; i < 20; ++i) test.equal(s(i + 20), s(i));
  s.domain([]);
  test.equal(s(0), "#1f77b4");
  test.equal(s(1), "#aec7e8");
  test.end();
});

tape("scaleCategory20() returns an isolated instance", function(test) {
  var s1 = scale.scaleCategory20(),
      s2 = scale.scaleCategory20();
  test.equal(s1(1), "#1f77b4");
  test.equal(s2(2), "#1f77b4");
  test.equal(s2(1), "#aec7e8");
  test.equal(s1(1), "#1f77b4");
  test.end();
});
