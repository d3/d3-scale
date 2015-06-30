import {bisect} from "d3-arrays";
import {default as linear, rebind} from "./linear";
import {format} from "d3-time-format";
import {second, minute, hour, day, month, week, year} from "d3-time";
import {tickRange} from "./ticks";

// import "../arrays/bisect";
// import "../arrays/range";
// import "../core/identity";
// import "../core/true";
// import "../scale/linear";
// import "../scale/nice";

function newTime(linear, tickIntervals, tickFormat) {

  function scale(x) {
    return linear(x);
  }

  scale.invert = function(x) {
    return new Date(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return linear.domain().map(function(t) { return new Date(t); });
    linear.domain(x);
    return scale;
  };

  function tickInterval(span, count) {
    var target = span / count,
        i = bisect(tickSteps, target);
    return i === tickSteps.length ? tickIntervals.year // TODO filter, tickRange(extent.map(function(d) { return d / 31536e6; }), count)[2]]
        : !i ? milliseconds // TODO filter , tickRange(extent, count)[2]]
        : tickIntervals[target / tickSteps[i - 1] < tickSteps[i] / target ? i - 1 : i];
  }

  // scale.nice = function(interval, skip) {
  //   var domain = scale.domain(),
  //       extent = d3_scaleExtent(domain),
  //       method = interval == null ? tickInterval(extent, 10)
  //         : typeof interval === "number" && tickInterval(extent, interval);

  //   if (method) interval = method[0], skip = method[1];

  //   function skipped(date) {
  //     return !isNaN(date) && !interval.range(date, new Date(+date + 1), skip).length;
  //   }

  //   return scale.domain(d3_scale_nice(domain, skip > 1 ? {
  //     floor: function(date) {
  //       while (skipped(date = interval.floor(date))) date = new Date(date - 1);
  //       return date;
  //     },
  //     ceil: function(date) {
  //       while (skipped(date = interval.ceil(date))) date = new Date(+date + 1);
  //       return date;
  //     }
  //   } : interval));
  // };

  // TODO step?
  scale.ticks = function(interval) {
    var domain = scale.domain(),
        start = domain[0],
        stop = domain[domain.length - 1];

        // extent = (stop < start && (extent = start, start = stop, stop = extent), [start, stop]),

    if (stop < start) range = start, start = stop, stop = range;

    var range = interval == null ? tickInterval(stop - start, 10).range
          : typeof interval === "number" ? tickInterval(stop - start, interval).range
          : interval.range || interval; // assume deprecated range function

    // if (method) range = method.range;

    return range(start, new Date(+stop + 1)); // inclusive upper bound
  };

  scale.tickFormat = function() {
    return tickFormat;
  };

  scale.copy = function() {
    return newTime(linear.copy(), tickMethods, tickFormat);
  };

  return rebind(scale, linear);
}

var tickSteps = [
  1e3,    // 1-second
  5e3,    // 5-second
  15e3,   // 15-second
  3e4,    // 30-second
  6e4,    // 1-minute
  3e5,    // 5-minute
  9e5,    // 15-minute
  18e5,   // 30-minute
  36e5,   // 1-hour
  108e5,  // 3-hour
  216e5,  // 6-hour
  432e5,  // 12-hour
  864e5,  // 1-day
  1728e5, // 2-day
  6048e5, // 1-week
  2592e6, // 1-month
  7776e6, // 3-month
  31536e6 // 1-year
];

var tickIntervals = [
  second,
  second.filter(function(d) { return d.getSeconds() % 5 === 0; }),
  second.filter(function(d) { return d.getSeconds() % 15 === 0; }),
  second.filter(function(d) { return d.getSeconds() % 30 === 0; }),
  minute,
  minute.filter(function(d) { return d.getSeconds() % 5 === 0; }),
  minute.filter(function(d) { return d.getSeconds() % 15 === 0; }),
  minute.filter(function(d) { return d.getSeconds() % 30 === 0; }),
  hour,
  hour.filter(function(d) { return d.getHours() % 3 === 0; }),
  hour.filter(function(d) { return d.getHours() % 6 === 0; }),
  hour.filter(function(d) { return d.getHours() % 12 === 0; }),
  day,
  day.filter(function(d) { return d.getDate() % 2 === 1; }),
  week,
  month,
  month.filter(function(d) { return d.getMonth() % 3 === 0; }),
  year
];

var milliseconds = {
  range: function(start, stop, step) { return range(Math.ceil(start / step) * step, +stop, step).map(function(t) { return new Date(t); }); },
  floor: function(d) { return new Date(+d); },
  ceil: function(d) { return new Date(+d); }
};

tickIntervals.year = year;

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

export default function() {
  return newTime(linear(), tickIntervals, tickFormat).domain([new Date(2000, 0, 1), new Date(2001, 0, 1)]);
};
