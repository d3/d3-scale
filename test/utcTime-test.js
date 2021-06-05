import assert from "assert";
import * as d3 from "../src/index.js";
import * as time from "d3-time";
import * as interpolate from "d3-interpolate";
import * as date from "./date.js";

it("scaleUtc.nice() is an alias for scaleUtc.nice(10)", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 17), date.utc(2009, 0, 1, 23, 42)]);
  assert.deepStrictEqual(x.nice().domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 2)]);
});

it("scaleUtc.nice() can nice sub-second domains", () => {
  const x = d3.scaleUtc().domain([date.utc(2013, 0, 1, 12, 0, 0, 0), date.utc(2013, 0, 1, 12, 0, 0, 128)]);
  assert.deepStrictEqual(x.nice().domain(), [date.utc(2013, 0, 1, 12, 0, 0, 0), date.utc(2013, 0, 1, 12, 0, 0, 130)]);
});

it("scaleUtc.nice() can nice multi-year domains", () => {
  const x = d3.scaleUtc().domain([date.utc(2001, 0, 1), date.utc(2138, 0, 1)]);
  assert.deepStrictEqual(x.nice().domain(), [date.utc(2000, 0, 1), date.utc(2140, 0, 1)]);
});

it("scaleUtc.nice() can nice empty domains", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 0, 12)]);
  assert.deepStrictEqual(x.nice().domain(), [date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 0, 12)]);
});

it("scaleUtc.nice(count) nices using the specified tick count", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 17), date.utc(2009, 0, 1, 23, 42)]);
  assert.deepStrictEqual(x.nice(100).domain(), [date.utc(2009, 0, 1, 0, 15), date.utc(2009, 0, 1, 23, 45)]);
  assert.deepStrictEqual(x.nice(10).domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 2)]);
});

it("scaleUtc.nice(interval) nices using the specified time interval", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 23, 48)]);
  assert.deepStrictEqual(x.nice(time.utcDay).domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 2)]);
  assert.deepStrictEqual(x.nice(time.utcWeek).domain(), [date.utc(2008, 11, 28), date.utc(2009, 0, 4)]);
  assert.deepStrictEqual(x.nice(time.utcMonth).domain(), [date.utc(2008, 11, 1), date.utc(2009, 1, 1)]);
  assert.deepStrictEqual(x.nice(time.utcYear).domain(), [date.utc(2008, 0, 1), date.utc(2010, 0, 1)]);
});

it("scaleUtc.nice(interval) can nice empty domains", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 0, 12)]);
  assert.deepStrictEqual(x.nice(time.utcDay).domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 2)]);
});

it("scaleUtc.nice(interval) can nice a polylinear domain, only affecting its extent", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 23, 48), date.utc(2009, 0, 2, 23, 48)]).nice(time.utcDay);
  assert.deepStrictEqual(x.domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 1, 23, 48), date.utc(2009, 0, 3)]);
});

it("scaleUtc.nice(interval.every(step)) nices using the specified time interval and step", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1, 0, 12), date.utc(2009, 0, 1, 23, 48)]);
  assert.deepStrictEqual(x.nice(time.utcDay.every(3)).domain(), [date.utc(2009, 0, 1), date.utc(2009, 0, 4)]);
  assert.deepStrictEqual(x.nice(time.utcWeek.every(2)).domain(), [date.utc(2008, 11, 21), date.utc(2009, 0, 4)]);
  assert.deepStrictEqual(x.nice(time.utcMonth.every(3)).domain(), [date.utc(2008, 9, 1), date.utc(2009, 3, 1)]);
  assert.deepStrictEqual(x.nice(time.utcYear.every(10)).domain(), [date.utc(2000, 0, 1), date.utc(2010, 0, 1)]);
});

it("scaleUtc.copy() isolates changes to the domain", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1), date.utc(2010, 0, 1)]), y = x.copy();
  x.domain([date.utc(2010, 0, 1), date.utc(2011, 0, 1)]);
  assert.deepStrictEqual(y.domain(), [date.utc(2009, 0, 1), date.utc(2010, 0, 1)]);
  assert.strictEqual(x(date.utc(2010, 0, 1)), 0);
  assert.strictEqual(y(date.utc(2010, 0, 1)), 1);
  y.domain([date.utc(2011, 0, 1), date.utc(2012, 0, 1)]);
  assert.strictEqual(x(date.utc(2011, 0, 1)), 1);
  assert.strictEqual(y(date.utc(2011, 0, 1)), 0);
  assert.deepStrictEqual(x.domain(), [date.utc(2010, 0, 1), date.utc(2011, 0, 1)]);
  assert.deepStrictEqual(y.domain(), [date.utc(2011, 0, 1), date.utc(2012, 0, 1)]);
});

it("scaleUtc.copy() isolates changes to the range", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1), date.utc(2010, 0, 1)]), y = x.copy();
  x.range([1, 2]);
  assert.deepStrictEqual(x.invert(1), date.utc(2009, 0, 1));
  assert.deepStrictEqual(y.invert(1), date.utc(2010, 0, 1));
  assert.deepStrictEqual(y.range(), [0, 1]);
  y.range([2, 3]);
  assert.deepStrictEqual(x.invert(2), date.utc(2010, 0, 1));
  assert.deepStrictEqual(y.invert(2), date.utc(2009, 0, 1));
  assert.deepStrictEqual(x.range(), [1, 2]);
  assert.deepStrictEqual(y.range(), [2, 3]);
});

it("scaleUtc.copy() isolates changes to the interpolator", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1), date.utc(2010, 0, 1)]).range(["red", "blue"]),
      i = x.interpolate(),
      y = x.copy();
  x.interpolate(interpolate.interpolateHsl);
  assert.strictEqual(x(date.utc(2009, 6, 1)), "rgb(255, 0, 253)");
  assert.strictEqual(y(date.utc(2009, 6, 1)), "rgb(129, 0, 126)");
  assert.strictEqual(y.interpolate(), i);
});

it("scaleUtc.copy() isolates changes to clamping", () => {
  const x = d3.scaleUtc().domain([date.utc(2009, 0, 1), date.utc(2010, 0, 1)]).clamp(true), y = x.copy();
  x.clamp(false);
  assert.strictEqual(x(date.utc(2011, 0, 1)), 2);
  assert.strictEqual(y(date.utc(2011, 0, 1)), 1);
  assert.strictEqual(y.clamp(), true);
  y.clamp(false);
  assert.strictEqual(x(date.utc(2011, 0, 1)), 2);
  assert.strictEqual(y(date.utc(2011, 0, 1)), 2);
  assert.strictEqual(x.clamp(), false);
});

it("scaleUtc.ticks(interval) observes the specified tick interval", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 1, 0), date.utc(2011, 0, 1, 12, 4, 4)]);
  assert.deepStrictEqual(x.ticks(time.utcMinute), [
    date.utc(2011, 0, 1, 12, 1),
    date.utc(2011, 0, 1, 12, 2),
    date.utc(2011, 0, 1, 12, 3),
    date.utc(2011, 0, 1, 12, 4)
  ]);
});

it("scaleUtc.ticks(interval) observes the specified named tick interval", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 1, 0), date.utc(2011, 0, 1, 12, 4, 4)]);
  assert.deepStrictEqual(x.ticks(time.utcMinute), [
    date.utc(2011, 0, 1, 12, 1),
    date.utc(2011, 0, 1, 12, 2),
    date.utc(2011, 0, 1, 12, 3),
    date.utc(2011, 0, 1, 12, 4)
  ]);
});

it("scaleUtc.ticks(interval.every(step)) observes the specified tick interval and step", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 33, 4)]);
  assert.deepStrictEqual(x.ticks(time.utcMinute.every(10)), [
    date.utc(2011, 0, 1, 12, 0),
    date.utc(2011, 0, 1, 12, 10),
    date.utc(2011, 0, 1, 12, 20),
    date.utc(2011, 0, 1, 12, 30)
  ]);
});

it("scaleUtc.ticks(count) can generate sub-second ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 0, 1)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 0, 0,   0),
    date.utc(2011, 0, 1, 12, 0, 0, 200),
    date.utc(2011, 0, 1, 12, 0, 0, 400),
    date.utc(2011, 0, 1, 12, 0, 0, 600),
    date.utc(2011, 0, 1, 12, 0, 0, 800),
    date.utc(2011, 0, 1, 12, 0, 1,   0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-second ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 0, 4)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 0, 0),
    date.utc(2011, 0, 1, 12, 0, 1),
    date.utc(2011, 0, 1, 12, 0, 2),
    date.utc(2011, 0, 1, 12, 0, 3),
    date.utc(2011, 0, 1, 12, 0, 4)
  ]);
});

it("scaleUtc.ticks(count) can generate 5-second ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 0, 20)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 0, 0),
    date.utc(2011, 0, 1, 12, 0, 5),
    date.utc(2011, 0, 1, 12, 0, 10),
    date.utc(2011, 0, 1, 12, 0, 15),
    date.utc(2011, 0, 1, 12, 0, 20)
  ]);
});

it("scaleUtc.ticks(count) can generate 15-second ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 0, 50)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 0, 0),
    date.utc(2011, 0, 1, 12, 0, 15),
    date.utc(2011, 0, 1, 12, 0, 30),
    date.utc(2011, 0, 1, 12, 0, 45)
  ]);
});

it("scaleUtc.ticks(count) can generate 30-second ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 0), date.utc(2011, 0, 1, 12, 1, 50)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 0, 0),
    date.utc(2011, 0, 1, 12, 0, 30),
    date.utc(2011, 0, 1, 12, 1, 0),
    date.utc(2011, 0, 1, 12, 1, 30)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-minute ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 0, 27), date.utc(2011, 0, 1, 12, 4, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 1),
    date.utc(2011, 0, 1, 12, 2),
    date.utc(2011, 0, 1, 12, 3),
    date.utc(2011, 0, 1, 12, 4)
  ]);
});

it("scaleUtc.ticks(count) can generate 5-minute ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 3, 27), date.utc(2011, 0, 1, 12, 21, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 5),
    date.utc(2011, 0, 1, 12, 10),
    date.utc(2011, 0, 1, 12, 15),
    date.utc(2011, 0, 1, 12, 20)
  ]);
});

it("scaleUtc.ticks(count) can generate 15-minute ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 8, 27), date.utc(2011, 0, 1, 13, 4, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 15),
    date.utc(2011, 0, 1, 12, 30),
    date.utc(2011, 0, 1, 12, 45),
    date.utc(2011, 0, 1, 13, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 30-minute ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 28, 27), date.utc(2011, 0, 1, 14, 4, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 12, 30),
    date.utc(2011, 0, 1, 13, 0),
    date.utc(2011, 0, 1, 13, 30),
    date.utc(2011, 0, 1, 14, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-hour ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 12, 28, 27), date.utc(2011, 0, 1, 16, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 13, 0),
    date.utc(2011, 0, 1, 14, 0),
    date.utc(2011, 0, 1, 15, 0),
    date.utc(2011, 0, 1, 16, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 3-hour ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 14, 28, 27), date.utc(2011, 0, 2, 1, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 15, 0),
    date.utc(2011, 0, 1, 18, 0),
    date.utc(2011, 0, 1, 21, 0),
    date.utc(2011, 0, 2, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 6-hour ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 16, 28, 27), date.utc(2011, 0, 2, 14, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 18, 0),
    date.utc(2011, 0, 2, 0, 0),
    date.utc(2011, 0, 2, 6, 0),
    date.utc(2011, 0, 2, 12, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 12-hour ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 16, 28, 27), date.utc(2011, 0, 3, 21, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 2, 0, 0),
    date.utc(2011, 0, 2, 12, 0),
    date.utc(2011, 0, 3, 0, 0),
    date.utc(2011, 0, 3, 12, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-day ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 16, 28, 27), date.utc(2011, 0, 5, 21, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 2, 0, 0),
    date.utc(2011, 0, 3, 0, 0),
    date.utc(2011, 0, 4, 0, 0),
    date.utc(2011, 0, 5, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 2-day ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 2, 16, 28, 27), date.utc(2011, 0, 9, 21, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 3, 0, 0),
    date.utc(2011, 0, 5, 0, 0),
    date.utc(2011, 0, 7, 0, 0),
    date.utc(2011, 0, 9, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-week ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 1, 16, 28, 27), date.utc(2011, 0, 23, 21, 34, 12)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 2, 0, 0),
    date.utc(2011, 0, 9, 0, 0),
    date.utc(2011, 0, 16, 0, 0),
    date.utc(2011, 0, 23, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-month ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2011, 0, 18), date.utc(2011, 4, 2)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 1, 1, 0, 0),
    date.utc(2011, 2, 1, 0, 0),
    date.utc(2011, 3, 1, 0, 0),
    date.utc(2011, 4, 1, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 3-month ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2010, 11, 18), date.utc(2011, 10, 2)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 0, 0),
    date.utc(2011, 3, 1, 0, 0),
    date.utc(2011, 6, 1, 0, 0),
    date.utc(2011, 9, 1, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate 1-year ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(2010, 11, 18), date.utc(2014, 2, 2)]);
  assert.deepStrictEqual(x.ticks(4), [
    date.utc(2011, 0, 1, 0, 0),
    date.utc(2012, 0, 1, 0, 0),
    date.utc(2013, 0, 1, 0, 0),
    date.utc(2014, 0, 1, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) can generate multi-year ticks", () => {
  const x = d3.scaleUtc().domain([date.utc(0, 11, 18), date.utc(2014, 2, 2)]);
  assert.deepStrictEqual(x.ticks(6), [
    date.utc( 500, 0, 1, 0, 0),
    date.utc(1000, 0, 1, 0, 0),
    date.utc(1500, 0, 1, 0, 0),
    date.utc(2000, 0, 1, 0, 0)
  ]);
});

it("scaleUtc.ticks(count) returns one tick for an empty domain", () => {
  const x = d3.scaleUtc().domain([date.utc(2014, 2, 2), date.utc(2014, 2, 2)]);
  assert.deepStrictEqual(x.ticks(6), [date.utc(2014, 2, 2)]);
});

it("scaleUtc.tickFormat()(date) formats year on New Year's", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 0, 1)), "2011");
  assert.strictEqual(f(date.utc(2012, 0, 1)), "2012");
  assert.strictEqual(f(date.utc(2013, 0, 1)), "2013");
});

it("scaleUtc.tickFormat()(date) formats month on the 1st of each month", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 1)), "February");
  assert.strictEqual(f(date.utc(2011, 2, 1)), "March");
  assert.strictEqual(f(date.utc(2011, 3, 1)), "April");
});

it("scaleUtc.tickFormat()(date) formats week on Sunday midnight", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 6)), "Feb 06");
  assert.strictEqual(f(date.utc(2011, 1, 13)), "Feb 13");
  assert.strictEqual(f(date.utc(2011, 1, 20)), "Feb 20");
});

it("scaleUtc.tickFormat()(date) formats date on midnight", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 2)), "Wed 02");
  assert.strictEqual(f(date.utc(2011, 1, 3)), "Thu 03");
  assert.strictEqual(f(date.utc(2011, 1, 4)), "Fri 04");
});

it("scaleUtc.tickFormat()(date) formats hour on minute zero", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 2, 11)), "11 AM");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12)), "12 PM");
  assert.strictEqual(f(date.utc(2011, 1, 2, 13)), "01 PM");
});

it("scaleUtc.tickFormat()(date) formats minute on second zero", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 2, 11, 59)), "11:59");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12,  1)), "12:01");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12,  2)), "12:02");
});

it("scaleUtc.tickFormat()(date) otherwise, formats second", () => {
  const f = d3.scaleUtc().tickFormat();
  assert.strictEqual(f(date.utc(2011, 1, 2, 12,  1,  9)), ":09");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12,  1, 10)), ":10");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12,  1, 11)), ":11");
});

it("scaleUtc.tickFormat(count, specifier) returns a time format for the specified specifier", () => {
  const f = d3.scaleUtc().tickFormat(10, "%c");
  assert.strictEqual(f(date.utc(2011, 1, 2, 12)), "2/2/2011, 12:00:00 PM");
});
