import {nice, ticks} from "d3-array";
import continuous, {copy} from "./continuous.js";
import {initRange} from "./init.js";
import tickFormat from "./tickFormat.js";

export function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;
    var d = domain(), n = d.length - 1;
    if (d[0] <= d[n]) [d[0], d[n]] = nice(d[0], d[n], count);
    else [d[n], d[0]] = nice(d[n], d[0], count);
    return domain(d);
  };

  return scale;
}

export default function linear() {
  var scale = continuous();

  scale.copy = function() {
    return copy(scale, linear());
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}
