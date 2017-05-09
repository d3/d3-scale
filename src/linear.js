import {ticks, tickStep} from "d3-array";
import {interpolateNumber as reinterpolate} from "d3-interpolate";
import {default as continuous, copy, deinterpolateLinear as deinterpolate} from "./continuous";
import tickFormat from "./tickFormat";

export function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    var d = domain(),
        i = d.length - 1,
        n = count == null ? 10 : count,
        step = tickStep(d[0], d[i], n),
        start = Math.floor(d[0] / step) * step,
        stop = Math.ceil(d[i] / step) * step;

    if (step) {
      step = tickStep(start, stop, n);
      d[0] = Math.floor(start / step) * step;
      d[i] = Math.ceil(stop / step) * step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

export default function linear() {
  var scale = continuous(deinterpolate, reinterpolate);

  scale.copy = function() {
    return copy(scale, linear());
  };

  return linearish(scale);
}
