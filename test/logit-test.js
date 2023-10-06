import assert from "assert";
import { scaleLogit } from "../src/index.js";
import {
  logitScaleDefDomain,
  mirrorNumber,
  getTick,
  guessDecade,
} from "../src/logit.js";
import { assertInDelta } from "./asserts.js";

const deltaValue = 1e-10;
const assertInDeltaCustom = (actual, expected) =>
  assertInDelta(actual, expected, deltaValue);

it("scaleLogit() has the expected defaults", () => {
  const s = scaleLogit();
  assert.deepStrictEqual(s.domain(), logitScaleDefDomain); // [0.001, 0.999]
  assert.deepStrictEqual(s.range(), [0, 1]);
  assert.strictEqual(s.clamp(), false);
});

it("for values out of range (0,1) returns NaN", () => {
  const s = scaleLogit();
  assert.deepStrictEqual(s(0), NaN);
  assert.deepStrictEqual(s(1), NaN);
  assert.deepStrictEqual(s(-1), NaN);
  assert.deepStrictEqual(s(2), NaN);
});

it("does not clamp by default", () => {
  const s = scaleLogit();
  assertInDeltaCustom(s(0.000001), -0.5001447858459409);
  assertInDeltaCustom(s(0.99999999999), 2.333598900780734);
});

it("logit.clamp(true)(x) clamps to the domain", () => {
  const s = scaleLogit().clamp(true);
  assert.deepStrictEqual(s(0.000001), 0);
  assert.deepStrictEqual(s(0.99999999999), 1);
  assert.deepStrictEqual(s(0), 0);
  assert.deepStrictEqual(s(1), 1);
  assert.deepStrictEqual(s(-1), 0);
  assert.deepStrictEqual(s(2), 1);
});

it("logit(x) maps a domain value x to a range value y", () => {
  const s = scaleLogit();
  assertInDeltaCustom(s(0.5), 0.5);
  assert.deepStrictEqual(s(0.999), 1);
  assert.deepStrictEqual(s(0.001), 0);
});

it("logit.range(…) can take colors", () => {
  const s = scaleLogit().range(["red", "blue"]);
  assert.strictEqual(s(0.5), "rgb(127, 0, 128)");
  assert.strictEqual(s(0.1), "rgb(168, 0, 87)");
  assert.strictEqual(s(0.9), "rgb(87, 0, 168)");
  s.range(["#ff0000", "#0000ff"]);
  assert.strictEqual(s(0.9), "rgb(87, 0, 168)");
  s.range(["#f00", "#00f"]);
  assert.strictEqual(s(0.9), "rgb(87, 0, 168)");
  // s.range([rgb(255, 0, 0), hsl(240, 1, 0.5)]);
  // assert.strictEqual(s(5), "rgb(77, 0, 178)");
  s.range(["hsl(0,100%,50%)", "hsl(240,100%,50%)"]);
  assert.strictEqual(s(0.1), "rgb(168, 0, 87)");
});

it("logit.nice() nices the domain, extending it to negative powers of ten", () => {
  const x = scaleLogit().domain([0.00015, 0.999987]).nice();
  assert.deepStrictEqual(x.domain(), [0.0001, 0.99999]);
  x.domain([0.35, 0.67]).nice();
  assert.deepStrictEqual(x.domain(), [0.1, 0.9]);
  x.domain([0.0000000000017, 0.999999999992]).nice();
  assert.deepStrictEqual(x.domain(), [0.000000000001, 0.999999999999]);
  assertInDeltaCustom(x(0.000000000001), 0);
  assertInDeltaCustom(x(0.999999999999), 1);
});

it("logit.invert(y) maps a range value y to a domain value x", () => {
  const s = scaleLogit();
  assertInDeltaCustom(s.invert(0), 0.001);
  assertInDeltaCustom(s.invert(1), 0.999);
  assertInDeltaCustom(s.invert(0.5), 0.5);
  s.domain([1e-6, 1 - 1e-6]);
  assertInDeltaCustom(s.invert(0), 1e-6);
  assertInDeltaCustom(s.invert(1), 1 - 1e-6);
  assertInDeltaCustom(s.invert(0.5), 0.5);
});

it("logit.invert(y) coerces range values to numbers", () => {
  const s = scaleLogit().range(["0", "1"]);
  assert.deepStrictEqual(s.invert(0), 0.001);
});

it("logit.domain(domain) coerces domain values to numbers", () => {
  assert.deepStrictEqual(
    scaleLogit().domain(["0.1", "0.9"]).domain(),
    [0.1, 0.9]
  );
  assert.deepStrictEqual(
    scaleLogit().domain(["0.00000012", "0.9999997"]).domain(),
    [0.00000012, 0.9999997]
  );
});

it("logit.ticks(count) returns the expected ticks for the default domain", () => {
  const s = scaleLogit();
  assert.deepStrictEqual(
    s.ticks(),
    [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99, 0.995, 0.999]
  );
  assert.deepStrictEqual(s.ticks(5), [0.001, 0.01, 0.1, 0.5, 0.9, 0.99, 0.999]);
  assert.deepStrictEqual(
    s.ticks(15),
    [
      0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.95,
      0.98, 0.99, 0.995, 0.998, 0.999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(20),
    [
      0.001, 0.002, 0.003, 0.005, 0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5,
      0.7, 0.8, 0.9, 0.95, 0.97, 0.98, 0.99, 0.995, 0.997, 0.998, 0.999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(25),
    [
      0.001, 0.002, 0.003, 0.005, 0.007, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.2,
      0.3, 0.5, 0.7, 0.8, 0.9, 0.93, 0.95, 0.97, 0.98, 0.99, 0.993, 0.995,
      0.997, 0.998, 0.999,
    ]
  );
});

it("logit.ticks(count) returns the expected ticks for an asimmetric domain [0.01, 0.99999]", () => {
  const s = scaleLogit().domain([0.01, 0.99999]);
  assert.deepStrictEqual(
    s.ticks(),
    [
      0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99, 0.995, 0.999, 0.9995, 0.9999,
      0.99995, 0.99999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(5),
    [0.01, 0.1, 0.5, 0.9, 0.99, 0.999, 0.9999, 0.99999]
  );
  assert.deepStrictEqual(
    s.ticks(15),
    [
      0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.95, 0.98, 0.99, 0.995, 0.998,
      0.999, 0.9995, 0.9998, 0.9999, 0.99995, 0.99998, 0.99999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(20),
    [
      0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.95, 0.98, 0.99, 0.995, 0.998,
      0.999, 0.9995, 0.9998, 0.9999, 0.99995, 0.99998, 0.99999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(25),
    [
      0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.97,
      0.98, 0.99, 0.995, 0.997, 0.998, 0.999, 0.9995, 0.9997, 0.9998, 0.9999,
      0.99995, 0.99997, 0.99998, 0.99999,
    ]
  );
});

it("logit.ticks(count) returns the expected ticks for the domain [0.001, 0.1]", () => {
  const s = scaleLogit().domain([0.001, 0.1]);
  assert.deepStrictEqual(
    s.ticks(),
    [0.001, 0.002, 0.003, 0.005, 0.007, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1]
  );
  assert.deepStrictEqual(s.ticks(2), [0.001, 0.01, 0.1]);
  assert.deepStrictEqual(
    s.ticks(5),
    [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1]
  );
  assert.deepStrictEqual(
    s.ticks(20),
    [0.001, 0.002, 0.003, 0.005, 0.007, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1]
  );
});

it("logit.ticks(count) returns the expected ticks for the domain [0.000001, 0.01]", () => {
  const s = scaleLogit().domain([0.000001, 0.01]);
  assert.deepStrictEqual(
    s.ticks(),
    [
      0.000001, 0.000002, 0.000005, 0.00001, 0.00002, 0.00005, 0.0001, 0.0002,
      0.0005, 0.001, 0.002, 0.005, 0.01,
    ]
  );
  assert.deepStrictEqual(s.ticks(3), [0.000001, 0.00001, 0.0001, 0.001, 0.01]);
  assert.deepStrictEqual(
    s.ticks(5),
    [0.000001, 0.000005, 0.00001, 0.00005, 0.0001, 0.0005, 0.001, 0.005, 0.01]
  );
  assert.deepStrictEqual(
    s.ticks(15),
    [
      0.000001, 0.000002, 0.000003, 0.000005, 0.00001, 0.00002, 0.00003,
      0.00005, 0.0001, 0.0002, 0.0003, 0.0005, 0.001, 0.002, 0.003, 0.005, 0.01,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(20),
    [
      0.000001, 0.000002, 0.000003, 0.000005, 0.000007, 0.00001, 0.00002,
      0.00003, 0.00005, 0.00007, 0.0001, 0.0002, 0.0003, 0.0005, 0.0007, 0.001,
      0.002, 0.003, 0.005, 0.007, 0.01,
    ]
  );
});

it("logit.ticks(count) returns the expected ticks for the domain [0.99, 0.9999999]", () => {
  const s = scaleLogit().domain([0.99, 0.9999999]);
  assert.deepStrictEqual(
    s.ticks(),
    [
      0.99, 0.995, 0.999, 0.9995, 0.9999, 0.99995, 0.99999, 0.999995, 0.999999,
      0.9999995, 0.9999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(3),
    [0.99, 0.999, 0.9999, 0.99999, 0.999999, 0.9999999]
  );
  assert.deepStrictEqual(
    s.ticks(5),
    [0.99, 0.999, 0.9999, 0.99999, 0.999999, 0.9999999]
  );
  assert.deepStrictEqual(
    s.ticks(15),
    [
      0.99, 0.995, 0.998, 0.999, 0.9995, 0.9998, 0.9999, 0.99995, 0.99998,
      0.99999, 0.999995, 0.999998, 0.999999, 0.9999995, 0.9999998, 0.9999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(20),
    [
      0.99, 0.995, 0.997, 0.998, 0.999, 0.9995, 0.9997, 0.9998, 0.9999, 0.99995,
      0.99997, 0.99998, 0.99999, 0.999995, 0.999997, 0.999998, 0.999999,
      0.9999995, 0.9999997, 0.9999998, 0.9999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(25),
    [
      0.99, 0.993, 0.995, 0.997, 0.998, 0.999, 0.9993, 0.9995, 0.9997, 0.9998,
      0.9999, 0.99993, 0.99995, 0.99997, 0.99998, 0.99999, 0.999993, 0.999995,
      0.999997, 0.999998, 0.999999, 0.9999993, 0.9999995, 0.9999997, 0.9999998,
      0.9999999,
    ]
  );
});

it("logit.ticks(count) returns the expected ticks for a 'broad' domain [0.000000000001, 0.999999999999]", () => {
  const s = scaleLogit().domain([0.000000000001, 0.999999999999]);
  assert.deepStrictEqual(
    s.ticks(),
    [
      1e-12, 1e-10, 1e-8, 0.000001, 0.0001, 0.01, 0.5, 0.99, 0.9999, 0.999999,
      0.99999999, 0.9999999999, 0.999999999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(1),
    [1e-12, 1e-8, 0.5, 0.99999999, 0.999999999999]
  );
  assert.deepStrictEqual(
    s.ticks(3),
    [1e-12, 1e-8, 0.0001, 0.5, 0.9999, 0.99999999, 0.999999999999]
  );
  assert.deepStrictEqual(
    s.ticks(5),
    [1e-12, 1e-8, 0.0001, 0.5, 0.9999, 0.99999999, 0.999999999999]
  );
  assert.deepStrictEqual(
    s.ticks(15),
    [
      1e-12, 1e-11, 1e-10, 1e-9, 1e-8, 1e-7, 0.000001, 0.00001, 0.0001, 0.001,
      0.01, 0.1, 0.5, 0.9, 0.99, 0.999, 0.9999, 0.99999, 0.999999, 0.9999999,
      0.99999999, 0.999999999, 0.9999999999, 0.99999999999, 0.999999999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(25),
    [
      1e-12, 5e-12, 1e-11, 5e-11, 1e-10, 5e-10, 1e-9, 5e-9, 1e-8, 5e-8, 1e-7,
      5e-7, 0.000001, 0.000005, 0.00001, 0.00005, 0.0001, 0.0005, 0.001, 0.005,
      0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99, 0.995, 0.999, 0.9995, 0.9999,
      0.99995, 0.99999, 0.999995, 0.999999, 0.9999995, 0.9999999, 0.99999995,
      0.99999999, 0.999999995, 0.999999999, 0.9999999995, 0.9999999999,
      0.99999999995, 0.99999999999, 0.999999999995, 0.999999999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(50),
    [
      1e-12, 2e-12, 5e-12, 1e-11, 2e-11, 5e-11, 1e-10, 2e-10, 5e-10, 1e-9, 2e-9,
      5e-9, 1e-8, 2e-8, 5e-8, 1e-7, 2e-7, 5e-7, 0.000001, 0.000002, 0.000005,
      0.00001, 0.00002, 0.00005, 0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005,
      0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.95, 0.98, 0.99, 0.995, 0.998,
      0.999, 0.9995, 0.9998, 0.9999, 0.99995, 0.99998, 0.99999, 0.999995,
      0.999998, 0.999999, 0.9999995, 0.9999998, 0.9999999, 0.99999995,
      0.99999998, 0.99999999, 0.999999995, 0.999999998, 0.999999999,
      0.9999999995, 0.9999999998, 0.9999999999, 0.99999999995, 0.99999999998,
      0.99999999999, 0.999999999995, 0.999999999998, 0.999999999999,
    ]
  );
  assert.deepStrictEqual(
    s.ticks(80),
    [
      1e-12, 2e-12, 3e-12, 5e-12, 1e-11, 2e-11, 3e-11, 5e-11, 1e-10, 2e-10,
      3e-10, 5e-10, 1e-9, 2e-9, 3e-9, 5e-9, 1e-8, 2e-8, 3e-8, 5e-8, 1e-7, 2e-7,
      3e-7, 5e-7, 0.000001, 0.000002, 0.000003, 0.000005, 0.00001, 0.00002,
      0.00003, 0.00005, 0.0001, 0.0002, 0.0003, 0.0005, 0.001, 0.002, 0.003,
      0.005, 0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95,
      0.97, 0.98, 0.99, 0.995, 0.997, 0.998, 0.999, 0.9995, 0.9997, 0.9998,
      0.9999, 0.99995, 0.99997, 0.99998, 0.99999, 0.999995, 0.999997, 0.999998,
      0.999999, 0.9999995, 0.9999997, 0.9999998, 0.9999999, 0.99999995,
      0.99999997, 0.99999998, 0.99999999, 0.999999995, 0.999999997, 0.999999998,
      0.999999999, 0.9999999995, 0.9999999997, 0.9999999998, 0.9999999999,
      0.99999999995, 0.99999999997, 0.99999999998, 0.99999999999,
      0.999999999995, 0.999999999997, 0.999999999998, 0.999999999999,
    ]
  );
});

it("logit.ticks(count) returns the expected ticks for a not nice domain", () => {
  const s = scaleLogit().domain([0.0017, 0.993]);
  assert.deepStrictEqual(
    s.ticks(),
    [0.005, 0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
  );
});

it("logit.range(range) makes a copy of range values", () => {
  const r = [1, 2];
  const s = scaleLogit().range(r);
  assert.deepStrictEqual(s.range(), [1, 2]);
  r.push(3);
  assert.deepStrictEqual(s.range(), [1, 2]);
  assert.deepStrictEqual(r, [1, 2, 3]);
});

it("logit.range() returns a copy of range values", () => {
  const s = scaleLogit();
  const r = s.range();
  assert.deepStrictEqual(r, [0, 1]);
  r.push(3);
  assert.deepStrictEqual(s.range(), [0, 1]);
});

it("logit.copy() isolates changes to the domain", () => {
  const x = scaleLogit();
  const y = x.copy();
  x.domain([0.0001, 0.999]);
  assert.deepStrictEqual(y.domain(), logitScaleDefDomain);
  assertInDeltaCustom(y(logitScaleDefDomain[0]), 0);
  assertInDeltaCustom(x(logitScaleDefDomain[0]), 0.14292276987827152);
  assertInDeltaCustom(x(0.0001), 0);
  y.domain([0.1, 0.9]);
  assertInDeltaCustom(x(0.0001), 0);
  assertInDeltaCustom(y(0.0001), -1.5958805171708443);
  assert.deepStrictEqual(x.domain(), [0.0001, 0.999]);
  assert.deepStrictEqual(y.domain(), [0.1, 0.9]);
});

it("logit.copy() isolates changes to the domain via nice", () => {
  const x = scaleLogit().domain([0.000027, 0.99994]);
  const y = x.copy().nice();
  assert.deepStrictEqual(x.domain(), [0.000027, 0.99994]);
  assertInDeltaCustom(x(0.000027), 0);
  assertInDeltaCustom(x(0.99994), 1);
  assertInDeltaCustom(x.invert(0), 0.000027);
  assertInDeltaCustom(x.invert(1), 0.99994);
  assert.deepStrictEqual(y.domain(), [0.00001, 0.99999]);
  assertInDeltaCustom(y(0.00001), 0);
  assertInDeltaCustom(y(0.99999), 1);
  assertInDeltaCustom(y.invert(0), 0.00001);
  assertInDeltaCustom(y.invert(1), 0.99999);
});

it("logit.copy() isolates changes to the range", () => {
  const x = scaleLogit();
  const y = x.copy();
  x.range([1, 2]);
  assertInDeltaCustom(x.invert(1), logitScaleDefDomain[0]);
  assertInDeltaCustom(y.invert(1), logitScaleDefDomain[1]);
  assert.deepStrictEqual(y.range(), [0, 1]);
  y.range([2, 3]);
  assertInDeltaCustom(x.invert(2), logitScaleDefDomain[1]);
  assertInDeltaCustom(y.invert(2), logitScaleDefDomain[0]);
  assert.deepStrictEqual(x.range(), [1, 2]);
  assert.deepStrictEqual(y.range(), [2, 3]);
});

it("logit.copy() isolates changes to clamping", () => {
  const x = scaleLogit().clamp(true);
  const y = x.copy();
  x.clamp(false);
  assertInDeltaCustom(x(0.0000001), -0.6668356607060651);
  assertInDeltaCustom(y(0.0000001), 0);
  assert.strictEqual(x.clamp(), false);
  assert.strictEqual(y.clamp(), true);
  y.clamp(false);
  x.clamp(true);
  assertInDeltaCustom(x(0.0000001), 0);
  assertInDeltaCustom(y(0.0000001), -0.6668356607060651);
  assert.strictEqual(x.clamp(), true);
  assert.strictEqual(y.clamp(), false);
});

it("get tick correctly", () => {
  assert.deepStrictEqual(getTick(-7, 1), 1e-7);
  assert.deepStrictEqual(getTick(-7, 2), 2e-7);
  assert.deepStrictEqual(getTick(-7, 5), 5e-7);
  assert.deepStrictEqual(getTick(-7, 7), 7e-7);
  assert.deepStrictEqual(getTick(7, 1), 1 - 1e-7);
  assert.deepStrictEqual(getTick(7, 2), 1 - 2e-7);
  assert.deepStrictEqual(getTick(7, 5), 1 - 5e-7);
  assert.deepStrictEqual(getTick(7, 7), 1 - 7e-7);
});

it("get tick correctly in the [0.1, 0.9] domain", () => {
  assert.deepStrictEqual(getTick(-1, 1), 0.1);
  assert.deepStrictEqual(getTick(-1, 3), 0.3);
  assert.deepStrictEqual(getTick(-1, 5), null);
  assert.deepStrictEqual(getTick(-1, 7), null);
  assert.deepStrictEqual(getTick(1, 1), 0.9);
  assert.deepStrictEqual(getTick(1, 3), 0.7);
  assert.deepStrictEqual(getTick(1, 5), null);
  assert.deepStrictEqual(getTick(1, 7), null);
});

it("tickformat return correct values", () => {
  const s = scaleLogit();
  assert.deepStrictEqual(
    [0.001, 0.01, 0.1, 0.5, 0.9, 0.99, 0.999].map(s.tickFormat()),
    ["1e-3", "0.01", "0.10", "0.50", "0.90", "0.99", "1-1e-3"]
  );
  assert.deepStrictEqual(
    [0.001, 0.01, 0.1, 0.5, 0.9, 0.99, 0.999].map(s.tickFormat(10, ["~s"])),
    ["1m", "10m", "100m", "500m", "900m", "990m", "999m"]
  );
  assert.deepStrictEqual(
    [0.01, 0.02, 0.05, 0.1, 0.5, 0.6, 0.9, 0.97, 0.99].map(s.tickFormat()),
    ["0.01", "0.02", "0.05", "0.10", "0.50", "0.60", "0.90", "0.97", "0.99"]
  );
  assert.deepStrictEqual(
    [0.01, 0.02, 0.05, 0.1, 0.5, 0.6, 0.9, 0.97, 0.99].map(
      s.tickFormat(10, ["~s"])
    ),
    ["10m", "20m", "50m", "100m", "500m", "600m", "900m", "970m", "990m"]
  );
});

it("find the correct decade of a number smaller than 0.5", () => {
  assert.strictEqual(guessDecade(0.3), -1);
  assert.strictEqual(guessDecade(0.1), -1);
  assert.strictEqual(guessDecade(0.03), -2);
  assert.strictEqual(guessDecade(0.01), -2);
  assert.strictEqual(guessDecade(0.0000003), -7);
  assert.strictEqual(guessDecade(0.0000001), -7);
  assert.strictEqual(guessDecade(0.000000000003), -12);
  assert.strictEqual(guessDecade(0.000000000001), -12);
  assert.strictEqual(guessDecade(1e-2), -2);
  assert.strictEqual(guessDecade(1e-5), -5);
  assert.strictEqual(guessDecade(1e-12), -12);
  assert.strictEqual(guessDecade(2e-12), -12);
  assert.strictEqual(guessDecade(1e-18), -18);
});

it("find the correct decade of a number bigger than 0.5", () => {
  assert.strictEqual(guessDecade(0.7), 1);
  assert.strictEqual(guessDecade(0.9), 1);
  assert.strictEqual(guessDecade(0.97), 2);
  assert.strictEqual(guessDecade(0.99), 2);
  assert.strictEqual(guessDecade(0.9997), 4);
  assert.strictEqual(guessDecade(0.9999), 4);
  assert.strictEqual(guessDecade(0.9999997), 7);
  assert.strictEqual(guessDecade(1 - 1e-2), 2);
  assert.strictEqual(guessDecade(1 - 1e-5), 5);
  assert.strictEqual(guessDecade(1 - 1e-10), 10);
  assert.strictEqual(guessDecade(1 - 1e-14), 14);
  assert.strictEqual(guessDecade(1 - 1e-16), 16);
});

it("mirrors correctly numbers in (0, 0.5]", () => {
  assert.strictEqual(mirrorNumber(7e-2), 0.93);
  assert.strictEqual(mirrorNumber(7e-5), 0.99993);
  assert.strictEqual(mirrorNumber(7e-7), 0.9999993);
  assert.strictEqual(mirrorNumber(7e-12), 0.999999999993);
  assert.strictEqual(mirrorNumber(3e-2), 0.97);
  assert.strictEqual(mirrorNumber(3e-5), 0.99997);
  assert.strictEqual(mirrorNumber(3e-7), 0.9999997);
  assert.strictEqual(mirrorNumber(3e-12), 0.999999999997);
  assert.strictEqual(mirrorNumber(5e-1), 0.5);
  assert.strictEqual(mirrorNumber(0.013), 0.987);
});

it("mirrors correctly numbers in [0.5, 1)", () => {
  assert.strictEqual(mirrorNumber(0.9993), 0.0007);
  assert.strictEqual(mirrorNumber(0.9997), 0.0003);
  assert.strictEqual(mirrorNumber(0.6666), 0.3334);
  assert.strictEqual(mirrorNumber(0.9999993), 0.0000007);
  assert.strictEqual(mirrorNumber(0.9999997), 0.0000003);
  assert.strictEqual(mirrorNumber(0.9996666), 0.0003334);
});
