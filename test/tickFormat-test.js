import assert from "node:assert";
import {it} from "vitest";
import {tickFormat} from "d3-scale";

it("tickFormat(start, stop, count) returns a format suitable for the ticks", () => {
  assert.strictEqual(tickFormat(0, 1, 10)(0.2), "0.2");
  assert.strictEqual(tickFormat(0, 1, 20)(0.2), "0.20");
  assert.strictEqual(tickFormat(-100, 100, 10)(-20), "−20");
});

it("tickFormat(start, stop, count, specifier) sets the appropriate fixed precision if not specified", () => {
  assert.strictEqual(tickFormat(0, 1, 10, "+f")(0.2), "+0.2");
  assert.strictEqual(tickFormat(0, 1, 20, "+f")(0.2), "+0.20");
  assert.strictEqual(tickFormat(0, 1, 10, "+%")(0.2), "+20%");
  assert.strictEqual(tickFormat(0.19, 0.21, 10, "+%")(0.2), "+20.0%");
});

it("tickFormat(start, stop, count, specifier) sets the appropriate round precision if not specified", () => {
  assert.strictEqual(tickFormat(0, 9, 10, "")(2.10), "2");
  assert.strictEqual(tickFormat(0, 9, 100, "")(2.01), "2");
  assert.strictEqual(tickFormat(0, 9, 100, "")(2.11), "2.1");
  assert.strictEqual(tickFormat(0, 9, 10, "e")(2.10), "2e+0");
  assert.strictEqual(tickFormat(0, 9, 100, "e")(2.01), "2.0e+0");
  assert.strictEqual(tickFormat(0, 9, 100, "e")(2.11), "2.1e+0");
  assert.strictEqual(tickFormat(0, 9, 10, "g")(2.10), "2");
  assert.strictEqual(tickFormat(0, 9, 100, "g")(2.01), "2.0");
  assert.strictEqual(tickFormat(0, 9, 100, "g")(2.11), "2.1");
  assert.strictEqual(tickFormat(0, 9, 10, "r")(2.10e6), "2000000");
  assert.strictEqual(tickFormat(0, 9, 100, "r")(2.01e6), "2000000");
  assert.strictEqual(tickFormat(0, 9, 100, "r")(2.11e6), "2100000");
  assert.strictEqual(tickFormat(0, 0.9, 10, "p")(0.210), "20%");
  assert.strictEqual(tickFormat(0.19, 0.21, 10, "p")(0.201), "20.1%");
});

it("tickFormat(start, stop, count, specifier) sets the appropriate prefix precision if not specified", () => {
  assert.strictEqual(tickFormat(0, 1e6, 10, "$s")(0.51e6), "$0.5M");
  assert.strictEqual(tickFormat(0, 1e6, 100, "$s")(0.501e6), "$0.50M");
});

it("tickFormat(start, stop, count) trims the default precision when the domain is invalid", () => {
  const f = tickFormat(0, NaN, 10);
  assert.strictEqual(f + "", " >-,~f");
  assert.strictEqual(f(0.12), "0.12");
  assert.strictEqual(f(Math.PI), "3.141593");
});

it("tickFormat(start, stop, count, specifier) trims trailing zeros when no precision can be derived", () => {
  assert.strictEqual(tickFormat(0, 0, 10)(0), "0");
  assert.strictEqual(tickFormat(0.5, 0.5, 10)(0.5), "0.5");
  assert.strictEqual(tickFormat(5, 5, 10)(5), "5");
  assert.strictEqual(tickFormat(-1.5, -1.5, 10)(-1.5), "−1.5");
  assert.strictEqual(tickFormat(0.5, 0.5, 10, "%")(0.5), "50%");
  assert.strictEqual(tickFormat(1.2, 1.2, 10, "r")(1.2), "1.2");
  assert.strictEqual(tickFormat(0.5, 0.5, 10, "e")(0.5), "5e-1");
  assert.strictEqual(tickFormat(1500, 1500, 10, "s")(1500), "1.5k");
  assert.strictEqual(tickFormat(-1, 1, 2, "r")(1), "1");
  assert.strictEqual(tickFormat(0, 1, 1, "p")(1), "100%");
  assert.strictEqual(tickFormat(0.5, 0.5, 10, ".2f")(0.5), "0.50");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10)(Math.PI), "3.141593");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10)(-Math.PI), "−3.141593");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10)(Math.PI * 1e7), "31,415,926.535898");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10, "r")(Math.PI), "3.14159");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10, "e")(Math.PI), "3.141593e+0");
  assert.strictEqual(tickFormat(Math.PI, Math.PI, 10, "%")(Math.PI / 100), "3.141593%");
  assert.strictEqual(tickFormat(Math.PI * 1e3, Math.PI * 1e3, 10, "s")(Math.PI * 1e3), "3.141593k");
});
