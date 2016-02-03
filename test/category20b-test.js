var tape = require("tape"),
    scale = require("../");

tape("scaleCategory20b() is an ordinal scale", function(test) {
  var s = scale.scaleCategory20b(), i;
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"]);
  test.equal(s(0), "#393b79");
  test.equal(s(1), "#5254a3");
  test.equal(s(0), "#393b79");
  for (i = 0; i < 20; ++i) s(i);
  for (i = 0; i < 20; ++i) test.equal(s(i + 20), s(i));
  s.domain([]);
  test.equal(s(0), "#393b79");
  test.equal(s(1), "#5254a3");
  test.end();
});

tape("scaleCategory20b() returns an isolated instance", function(test) {
  var s1 = scale.scaleCategory20b(),
      s2 = scale.scaleCategory20b();
  test.equal(s1(1), "#393b79");
  test.equal(s2(2), "#393b79");
  test.equal(s2(1), "#5254a3");
  test.equal(s1(1), "#393b79");
  test.end();
});
