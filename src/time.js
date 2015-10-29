import {bisector, range} from "d3-arrays";
import linear, {rebind} from "./linear";
import {format} from "d3-time-format";
import {second, minute, hour, day, month, week, year} from "d3-time";
import {tickRange} from "./ticks";

function newDate(t) {
  return new Date(t);
}

export function newTime(linear, timeInterval, tickFormat, format) {

  function scale(x) {
    return linear(x);
  }

  scale.invert = function(x) {
    return newDate(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return linear.domain().map(newDate);
    linear.domain(x);
    return scale;
  };

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // If a named interval such as "seconds" was specified, convert to the
    // corresponding time interval and optionally filter using the step.
    // Otherwise, assume interval is already a time interval and use it.
    switch (typeof interval) {
      case "number": interval = chooseTickInterval(start, stop, interval), step = interval[1], interval = interval[0]; break;
      case "string": step = step == null ? 1 : Math.floor(step); break;
      default: return interval;
    }

    return isFinite(step) && step > 0 ? timeInterval(interval, step) : null;
  }

  scale.ticks = function(interval, step) {
    var domain = linear.domain(),
        t0 = domain[0],
        t1 = domain[domain.length - 1],
        t;

    if (t1 < t0) t = t0, t0 = t1, t1 = t;

    return (interval = tickInterval(interval, t0, t1, step))
        ? interval.range(t0, t1 + 1) // inclusive stop
        : [];
  };

  scale.tickFormat = function(specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function(interval, step) {
    var domain = linear.domain(),
        i0 = 0,
        i1 = domain.length - 1,
        t0 = domain[i0],
        t1 = domain[i1],
        t;

    if (t1 < t0) {
      t = i0, i0 = i1, i1 = t;
      t = t0, t0 = t1, t1 = t;
    }

    if (interval = tickInterval(interval, t0, t1, step)) {
      domain[i0] = +interval.floor(t0);
      domain[i1] = +interval.ceil(t1);
      linear.domain(domain);
    }

    return scale;
  };

  scale.copy = function() {
    return newTime(linear.copy(), timeInterval, tickFormat, format);
  };

  return rebind(scale, linear);
};

var millisecondsPerSecond = 1000,
    millisecondsPerMinute = millisecondsPerSecond * 60,
    millisecondsPerHour = millisecondsPerMinute * 60,
    millisecondsPerDay = millisecondsPerHour * 24,
    millisecondsPerWeek = millisecondsPerDay * 7,
    millisecondsPerMonth = millisecondsPerDay * 30,
    millisecondsPerYear = millisecondsPerDay * 365;

var tickIntervals = [
  ["seconds",  1,      millisecondsPerSecond],
  ["seconds",  5,  5 * millisecondsPerSecond],
  ["seconds", 15, 15 * millisecondsPerSecond],
  ["seconds", 30, 30 * millisecondsPerSecond],
  ["minutes",  1,      millisecondsPerMinute],
  ["minutes",  5,  5 * millisecondsPerMinute],
  ["minutes", 15, 15 * millisecondsPerMinute],
  ["minutes", 30, 30 * millisecondsPerMinute],
  [  "hours",  1,      millisecondsPerHour  ],
  [  "hours",  3,  3 * millisecondsPerHour  ],
  [  "hours",  6,  6 * millisecondsPerHour  ],
  [  "hours", 12, 12 * millisecondsPerHour  ],
  [   "days",  1,      millisecondsPerDay   ],
  [   "days",  2,  2 * millisecondsPerDay   ],
  [  "weeks",  1,      millisecondsPerWeek  ],
  [ "months",  1,      millisecondsPerMonth ],
  [ "months",  3,  3 * millisecondsPerMonth ],
  [  "years",  1,      millisecondsPerYear  ]
];

var bisectTickIntervals = bisector(function(method) {
  return method[2];
}).right;

function chooseTickInterval(start, stop, count) {
  var target = Math.abs(stop - start) / count,
      i = bisectTickIntervals(tickIntervals, target);
  return i === tickIntervals.length ? ["years", tickRange([start / millisecondsPerYear, stop / millisecondsPerYear], count)[2]]
      : i ? tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i]
      : ["milliseconds", tickRange([start, stop], count)[2]];
}

var formatMillisecond = format(".%L"),
    formatSecond = format(":%S"),
    formatMinute = format("%I:%M"),
    formatHour = format("%I %p"),
    formatDay = format("%a %d"),
    formatWeek = format("%b %d"),
    formatMonth = format("%B"),
    formatYear = format("%Y");

function tickFormat(date) {
  return (second(date) < date ? formatMillisecond
      : minute(date) < date ? formatSecond
      : hour(date) < date ? formatMinute
      : day(date) < date ? formatHour
      : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
      : year(date) < date ? formatMonth
      : formatYear)(date);
}

export function millisecond(step) {
  return {
    range: function(start, stop) { return range(Math.ceil(start / step) * step, stop, step).map(newDate); },
    floor: function(date) { return newDate(Math.floor(date / step) * step); },
    ceil: function(date) { return newDate(Math.ceil(date / step) * step); }
  };
};

function timeInterval(interval, step) {
  switch (interval) {
    case "milliseconds": return millisecond(step);
    case "seconds": return step > 1 ? second.filter(function(d) { return d.getSeconds() % step === 0; }) : second;
    case "minutes": return step > 1 ? minute.filter(function(d) { return d.getMinutes() % step === 0; }) : minute;
    case "hours": return step > 1 ? hour.filter(function(d) { return d.getHours() % step === 0; }) : hour;
    case "days": return step > 1 ? day.filter(function(d) { return (d.getDate() - 1) % step === 0; }) : day;
    case "weeks": return step > 1 ? week.filter(function(d) { return week.count(0, d) % step === 0; }) : week;
    case "months": return step > 1 ? month.filter(function(d) { return d.getMonth() % step === 0; }) : month;
    case "years": return step > 1 ? year.filter(function(d) { return d.getFullYear() % step === 0; }) : year;
  }
}

export default function() {
  return newTime(linear(), timeInterval, tickFormat, format).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};
