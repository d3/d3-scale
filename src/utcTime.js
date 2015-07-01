import {default as linear} from "./linear";
import {filterMillisecond, newTime} from "./time";
import {range} from "d3-arrays";
import {utcFormat} from "d3-time-format";
import {utcSecond, utcMinute, utcHour, utcDay, utcMonth, utcWeek, utcYear} from "d3-time";

var formatMillisecond = utcFormat(".%L"),
    formatSecond = utcFormat(":%S"),
    formatMinute = utcFormat("%I:%M"),
    formatHour = utcFormat("%I %p"),
    formatDay = utcFormat("%a %d"),
    formatWeek = utcFormat("%b %d"),
    formatMonth = utcFormat("%B"),
    formatYear = utcFormat("%Y");

function formatTime(date) {
  return (utcSecond(date) < date ? formatMillisecond
      : utcMinute(date) < date ? formatSecond
      : utcHour(date) < date ? formatMinute
      : utcDay(date) < date ? formatHour
      : utcMonth(date) < date ? (utcWeek(date) < date ? formatDay : formatWeek)
      : utcYear(date) < date ? formatMonth
      : formatYear)(date);
}

function timeInterval(interval, step) {
  switch (interval) {
    case "milliseconds": return filterMillisecond(step);
    case "seconds": return step > 1 ? utcSecond.filter(function(d) { return d.getUTCSeconds() % step === 0; }) : utcSecond;
    case "minutes": return step > 1 ? utcMinute.filter(function(d) { return d.getUTCMinutes() % step === 0; }) : utcMinute;
    case "hours": return step > 1 ? utcHour.filter(function(d) { return d.getUTCHours() % step === 0; }) : utcHour;
    case "days": return step > 1 ? utcDay.filter(function(d) { return (d.getUTCDate() - 1) % step === 0; }) : utcDay;
    case "weeks": return step > 1 ? utcWeek.filter(function(d) { return utcWeek.count(0, d) % step === 0; }) : utcWeek;
    case "months": return step > 1 ? utcMonth.filter(function(d) { return d.getUTCMonth() % step === 0; }) : utcMonth;
    case "years": return step > 1 ? utcYear.filter(function(d) { return d.getUTCFullYear() % step === 0; }) : utcYear;
  }
}

export default function() {
  return newTime(linear(), timeInterval, formatTime).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
};
