import assert from "assert";
import * as d3 from "../src/index.js";

it("scaleSqrt() has the expected defaults", () => {
  const s = d3.scaleSqrt();
  assert.deepStrictEqual(s.domain(), [0, 1]);
  assert.deepStrictEqual(s.range(), [0, 1]);
  assert.strictEqual(s.clamp(), false);
  assert.strictEqual(s.exponent(), 0.5);
  assert.deepStrictEqual(s.interpolate()({array: ["red"]}, {array: ["blue"]})(0.5), {array: ["rgb(128, 0, 128)"]});
});

it("sqrt(x) maps a domain value x to a range value y", () => {
  assert.strictEqual(d3.scaleSqrt()(0.5), Math.SQRT1_2);
});
