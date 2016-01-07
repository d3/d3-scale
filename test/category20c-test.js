var tape = require("tape"),
    scale = require("../");

tape("scaleCategory20c() is an ordinal scale", function(test) {
  var s = scale.scaleCategory20c();
  test.deepEqual(s.domain(), []);
  test.deepEqual(s.range(), ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"]);
  test.equal(s(0), "#3182bd");
  test.equal(s(1), "#6baed6");
  test.equal(s(0), "#3182bd");
  for (var i = 0; i < 20; ++i) s(i);
  for (var i = 0; i < 20; ++i) test.equal(s(i + 20), s(i));
  s.domain([]);
  test.equal(s(0), "#3182bd");
  test.equal(s(1), "#6baed6");
  test.end();
});

tape("scaleCategory20c() returns an isolated instance", function(test) {
  var s1 = scale.scaleCategory20c(),
      s2 = scale.scaleCategory20c();
  test.equal(s1(1), "#3182bd");
  test.equal(s2(2), "#3182bd");
  test.equal(s2(1), "#6baed6");
  test.equal(s1(1), "#3182bd");
  test.end();
});
