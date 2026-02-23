import assert from "assert";
import {scaleSymlog} from "../src/index.js";
import {assertInDelta} from "./asserts.js";

it("scaleSymlog() has the expected defaults", () => {
  const s = scaleSymlog();
  assert.deepStrictEqual(s.domain(), [0, 1]);
  assert.deepStrictEqual(s.range(), [0, 1]);
  assert.strictEqual(s.clamp(), false);
  assert.strictEqual(s.constant(), 1);
});

it("symlog(x) maps a domain value x to a range value y", () => {
  const s = scaleSymlog().domain([-100, 100]);
  assert.strictEqual(s(-100), 0);
  assert.strictEqual(s(100), 1);
  assert.strictEqual(s(0), 0.5);
});

it("symlog.invert(y) maps a range value y to a domain value x", () => {
  const s = scaleSymlog().domain([-100, 100]);
  assertInDelta(s.invert(1), 100);
});

it("symlog.invert(y) coerces range values to numbers", () => {
  const s = scaleSymlog().range(["-3", "3"]);
  assert.deepStrictEqual(s.invert(3), 1);
});

it("symlog.invert(y) returns NaN if the range is not coercible to number", () => {
  assert(isNaN(scaleSymlog().range(["#000", "#fff"]).invert("#999")));
  assert(isNaN(scaleSymlog().range([0, "#fff"]).invert("#999")));
});

it("symlog.constant(constant) sets the constant to the specified value", () => {
  const s = scaleSymlog().constant(5);
  assert.strictEqual(s.constant(), 5);
});

it("symlog.constant(constant) changing the constant does not change the domain or range", () => {
  const s = scaleSymlog().constant(2);
  assert.deepStrictEqual(s.domain(), [0, 1]);
  assert.deepStrictEqual(s.range(), [0, 1]);
});

it("symlog.domain(domain) accepts an array of numbers", () => {
  assert.deepStrictEqual(scaleSymlog().domain([]).domain(), []);
  assert.deepStrictEqual(scaleSymlog().domain([1, 0]).domain(), [1, 0]);
  assert.deepStrictEqual(scaleSymlog().domain([1, 2, 3]).domain(), [1, 2, 3]);
});

it("symlog.domain(domain) coerces domain values to numbers", () => {
  assert.deepStrictEqual(scaleSymlog().domain([new Date(Date.UTC(1990, 0, 1)), new Date(Date.UTC(1991, 0, 1))]).domain(), [631152000000, 662688000000]);
  assert.deepStrictEqual(scaleSymlog().domain(["0.0", "1.0"]).domain(), [0, 1]);
  assert.deepStrictEqual(scaleSymlog().domain([new Number(0), new Number(1)]).domain(), [0, 1]);
});

it("symlog.domain(domain) makes a copy of domain values", () => {
  const d = [1, 2], s = scaleSymlog().domain(d);
  assert.deepStrictEqual(s.domain(), [1, 2]);
  d.push(3);
  assert.deepStrictEqual(s.domain(), [1, 2]);
  assert.deepStrictEqual(d, [1, 2, 3]);
});

it("symlog.domain() returns a copy of domain values", () => {
  const s = scaleSymlog(), d = s.domain();
  assert.deepStrictEqual(d, [0, 1]);
  d.push(3);
  assert.deepStrictEqual(s.domain(), [0, 1]);
});

it("symlog.range(range) does not coerce range to numbers", () => {
  const s = scaleSymlog().range(["0px", "2px"]);
  assert.deepStrictEqual(s.range(), ["0px", "2px"]);
  assert.strictEqual(s(1), "2px");
});

it("symlog.range(range) can accept range values as arrays or objects", () => {
  assert.deepStrictEqual(scaleSymlog().range([{color: "red"}, {color: "blue"}])(1), {color: "rgb(0, 0, 255)"});
  assert.deepStrictEqual(scaleSymlog().range([["red"], ["blue"]])(0), ["rgb(255, 0, 0)"]);
});

it("symlog.range(range) makes a copy of range values", () => {
  const r = [1, 2], s = scaleSymlog().range(r);
  assert.deepStrictEqual(s.range(), [1, 2]);
  r.push(3);
  assert.deepStrictEqual(s.range(), [1, 2]);
  assert.deepStrictEqual(r, [1, 2, 3]);
});

it("symlog.range() returns a copy of range values", () => {
  const s = scaleSymlog(), r = s.range();
  assert.deepStrictEqual(r, [0, 1]);
  r.push(3);
  assert.deepStrictEqual(s.range(), [0, 1]);
});

it("symlog.clamp() is false by default", () => {
  assert.strictEqual(scaleSymlog().clamp(), false);
  assert.strictEqual(scaleSymlog().range([10, 20])(3), 30);
  assert.strictEqual(scaleSymlog().range([10, 20])(-1), 0);
  assert.strictEqual(scaleSymlog().range([10, 20]).invert(30), 3);
  assert.strictEqual(scaleSymlog().range([10, 20]).invert(0), -1);
});

it("symlog.clamp(true) restricts output values to the range", () => {
  assert.strictEqual(scaleSymlog().clamp(true).range([10, 20])(2), 20);
  assert.strictEqual(scaleSymlog().clamp(true).range([10, 20])(-1), 10);
});

it("symlog.clamp(true) restricts input values to the domain", () => {
  assert.strictEqual(scaleSymlog().clamp(true).range([10, 20]).invert(30), 1);
  assert.strictEqual(scaleSymlog().clamp(true).range([10, 20]).invert(0), 0);
});

it("symlog.clamp(clamp) coerces the specified clamp value to a boolean", () => {
  assert.strictEqual(scaleSymlog().clamp("true").clamp(), true);
  assert.strictEqual(scaleSymlog().clamp(1).clamp(), true);
  assert.strictEqual(scaleSymlog().clamp("").clamp(), false);
  assert.strictEqual(scaleSymlog().clamp(0).clamp(), false);
});

it("symlog.copy() returns a copy with changes to the domain are isolated", () => {
  const x = scaleSymlog(), y = x.copy();
  x.domain([1, 2]);
  assert.deepStrictEqual(y.domain(), [0, 1]);
  assert.strictEqual(x(1), 0);
  assert.strictEqual(y(1), 1);
  y.domain([2, 3]);
  assert.strictEqual(x(2), 1);
  assert.strictEqual(y(2), 0);
  assert.deepStrictEqual(x.domain(), [1, 2]);
  assert.deepStrictEqual(y.domain(), [2, 3]);
  const y2 = x.domain([1, 1.9]).copy();
  x.nice(5);
  assert.deepStrictEqual(x.domain(), [1, 2]);
  assert.deepStrictEqual(y2.domain(), [1, 1.9]);
});

it("symlog.copy() returns a copy with changes to the range are isolated", () => {
  const x = scaleSymlog(), y = x.copy();
  x.range([1, 2]);
  assert.strictEqual(x.invert(1), 0);
  assert.strictEqual(y.invert(1), 1);
  assert.deepStrictEqual(y.range(), [0, 1]);
  y.range([2, 3]);
  assert.strictEqual(x.invert(2), 1);
  assert.strictEqual(y.invert(2), 0);
  assert.deepStrictEqual(x.range(), [1, 2]);
  assert.deepStrictEqual(y.range(), [2, 3]);
});

it("symlog.copy() returns a copy with changes to clamping are isolated", () => {
  const x = scaleSymlog().clamp(true), y = x.copy();
  x.clamp(false);
  assert.strictEqual(x(3), 2);
  assert.strictEqual(y(2), 1);
  assert.strictEqual(y.clamp(), true);
  y.clamp(false);
  assert.strictEqual(x(3), 2);
  assert.strictEqual(y(3), 2);
  assert.strictEqual(x.clamp(), false);
});

it("symlog().clamp(true).invert(x) cannot return a value outside the domain", () => {
  const x = scaleSymlog().domain([1, 20]).clamp(true);
  assert.strictEqual(x.invert(0), 1);
  assert.strictEqual(x.invert(1), 20);
});

it("symlog.ticks() generates nice ticks across orders of magnitude", () => {
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(10), [0, 2, 15, 60, 300, 1000, 4000, 15000, 60000, 300000, 1000000]);
});

it("symlog.ticks() respects the requested count", () => {
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(5), [0, 15, 300, 4000, 60000, 1000000]);
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(20), [0, 1, 3, 7, 14, 30, 60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000, 30000, 60000, 120000, 250000, 500000, 1000000]);
});

it("symlog.ticks() handles low counts", () => {
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(1), [0, 1000000]);
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(2), [0, 1000, 1000000]);
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(3), [0, 100, 10000, 1000000]);
});

it("symlog.ticks() generates symmetric ticks for symmetric domains", () => {
  const t = scaleSymlog().domain([-1e6, 1e6]).ticks(10);
  assert.deepStrictEqual(t, [-1000000, -50000, -5000, -200, -20, 0, 20, 200, 5000, 50000, 1000000]);
});

it("symlog.ticks() generates symmetric ticks for smaller domains", () => {
  assert.deepStrictEqual(scaleSymlog().domain([-100, 100]).ticks(10), [-100, -40, -15, -6, -1.5, 0, 1.5, 6, 15, 40, 100]);
});

it("symlog.ticks() is independent of the range", () => {
  const a = scaleSymlog().domain([0, 1e6]).range([0, 1]).ticks(10);
  const b = scaleSymlog().domain([0, 1e6]).range([0, 640]).ticks(10);
  assert.deepStrictEqual(a, b);
});

it("symlog.ticks() handles reversed domains", () => {
  assert.deepStrictEqual(scaleSymlog().domain([1e6, 0]).ticks(10), [1000000, 300000, 60000, 15000, 4000, 1000, 300, 60, 15, 2, 0]);
});

it("symlog.ticks() adapts to the constant", () => {
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).constant(1000).ticks(10), [0, 1000, 3000, 7000, 14000, 30000, 60000, 120000, 250000, 500000, 1000000]);
});

it("symlog.ticks() always includes zero when it is in the domain", () => {
  assert.ok(scaleSymlog().domain([0, 1e6]).ticks(10).includes(0));
  assert.ok(scaleSymlog().domain([-1e6, 0]).ticks(10).includes(0));
  assert.ok(scaleSymlog().domain([-1e6, 1e6]).ticks(10).includes(0));
  assert.ok(scaleSymlog().domain([-1e6, 1e3]).ticks(10).includes(0));
});

it("symlog.ticks() allocates ticks proportionally for asymmetric domains", () => {
  assert.deepStrictEqual(scaleSymlog().domain([-1e6, 1e3]).ticks(10), [-1000000, -100000, -20000, -2000, -400, -60, -5, 0, 10, 100, 1000]);
});

it("symlog.ticks() works when zero is not in the domain", () => {
  assert.deepStrictEqual(scaleSymlog().domain([100, 1e6]).ticks(10), [100, 250, 600, 1500, 4000, 10000, 25000, 60000, 150000, 400000, 1000000]);
  assert.deepStrictEqual(scaleSymlog().domain([1e6, 100]).ticks(10), [1000000, 400000, 150000, 60000, 25000, 10000, 4000, 1500, 600, 250, 100]);
});

it("symlog.ticks() handles edge cases", () => {
  assert.deepStrictEqual(scaleSymlog().domain([0, 1e6]).ticks(0), []);
  assert.deepStrictEqual(scaleSymlog().domain([5, 5]).ticks(10), [5]);
});

it("symlog.ticks() on a copy is isolated", () => {
  const s1 = scaleSymlog().domain([0, 1e6]);
  const s2 = s1.copy();
  assert.deepStrictEqual(s2.ticks(10), [0, 2, 15, 60, 300, 1000, 4000, 15000, 60000, 300000, 1000000]);
  s1.domain([0, 100]);
  assert.deepStrictEqual(s2.ticks(10), [0, 2, 15, 60, 300, 1000, 4000, 15000, 60000, 300000, 1000000]);
});

it("symlog.tickFormat() defaults to SI prefix format, computed per tick", () => {
  const s = scaleSymlog().domain([0, 1e6]);
  const f = s.tickFormat();
  assert.strictEqual(f(0), "0");
  assert.strictEqual(f(0.01), "10m");
  assert.strictEqual(f(0.1), "100m");
  assert.strictEqual(f(1000), "1k");
  assert.strictEqual(f(500000), "500k");
  assert.strictEqual(f(1e6), "1M");
});

it("symlog.tickFormat(count, specifier) accepts a format specifier", () => {
  const s = scaleSymlog().domain([0, 100]);
  assert.strictEqual(s.tickFormat(10, ",.0f")(50), "50");
  assert.strictEqual(s.tickFormat(10, "+f")(50), "+50");
});

it("symlog.tickFormat(count, specifier) accepts a function specifier", () => {
  const s = scaleSymlog().domain([0, 100]);
  assert.strictEqual(s.tickFormat(10, (x) => `${x}a`)(42), "42a");
});
