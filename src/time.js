import {bisector} from "d3-arrays";
import linear, {rebind} from "./linear";
import {format} from "d3-time-format";
import {year, month, week, day, hour, minute, second, millisecond} from "d3-time";
import {tickRange} from "./ticks";

var millisecondsPerSecond = 1000,
    millisecondsPerMinute = millisecondsPerSecond * 60,
    millisecondsPerHour = millisecondsPerMinute * 60,
    millisecondsPerDay = millisecondsPerHour * 24,
    millisecondsPerWeek = millisecondsPerDay * 7,
    millisecondsPerMonth = millisecondsPerDay * 30,
    millisecondsPerYear = millisecondsPerDay * 365,
    bisectTickIntervals = bisector(function(method) { return method[2]; }).right;

function newDate(t) {
  return new Date(t);
}

export function newTime(linear, year, month, week, day, hour, minute, second, millisecond, format) {
  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");

  var tickIntervals = [
    [second,  1,      millisecondsPerSecond],
    [second,  5,  5 * millisecondsPerSecond],
    [second, 15, 15 * millisecondsPerSecond],
    [second, 30, 30 * millisecondsPerSecond],
    [minute,  1,      millisecondsPerMinute],
    [minute,  5,  5 * millisecondsPerMinute],
    [minute, 15, 15 * millisecondsPerMinute],
    [minute, 30, 30 * millisecondsPerMinute],
    [  hour,  1,      millisecondsPerHour  ],
    [  hour,  3,  3 * millisecondsPerHour  ],
    [  hour,  6,  6 * millisecondsPerHour  ],
    [  hour, 12, 12 * millisecondsPerHour  ],
    [   day,  1,      millisecondsPerDay   ],
    [   day,  2,  2 * millisecondsPerDay   ],
    [  week,  1,      millisecondsPerWeek  ],
    [ month,  1,      millisecondsPerMonth ],
    [ month,  3,  3 * millisecondsPerMonth ],
    [  year,  1,      millisecondsPerYear  ]
  ];

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

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = bisectTickIntervals(tickIntervals, target);
      if (i === tickIntervals.length) {
        step = tickRange([start / millisecondsPerYear, stop / millisecondsPerYear], interval)[2];
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = tickRange([start, stop], interval)[2];
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
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
    return newTime(linear.copy(), year, month, week, day, hour, minute, second, millisecond, format);
  };

  return rebind(scale, linear);
};

export default function() {
  return newTime(linear(), year, month, week, day, hour, minute, second, millisecond, format).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};
