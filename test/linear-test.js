var tape = require("tape"),
    scale = require("../");

tape("linear() returns a function", function(test) {
  test.equal(typeof scale.linear(), "function");
  test.end();
});
