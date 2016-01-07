import {bisector, tickStep} from "d3-array";
import {interpolateNumber as reinterpolate} from "d3-interpolate";
import {timeYear, timeMonth, timeWeek, timeDay, timeHour, timeMinute, timeSecond, timeMillisecond} from "d3-time";
import {timeFormat} from "d3-time-format";
import nice from "./nice";
import {default as continuous, copy, deinterpolateLinear as deinterpolate} from "./continuous";

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

export function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = continuous(deinterpolate, reinterpolate),
      invert = scale.invert,
      domain = scale.domain;

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
        step = tickStep(start / millisecondsPerYear, stop / millisecondsPerYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = tickStep(start, stop, interval);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(_) : domain().map(newDate);
  };

  scale.nice = function(interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
        ? domain(nice(d, interval))
        : scale;
  };

  scale.ticks = function(interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
    return r ? t.reverse() : t;
  };

  scale.tickFormat = function(specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.copy = function() {
    return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
};

export default function() {
  return calendar(timeYear, timeMonth, timeWeek, timeDay, timeHour, timeMinute, timeSecond, timeMillisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};
