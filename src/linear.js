import {ticks, tickStep} from "d3-array";
import {number as reinterpolate} from "d3-interpolate";
import {default as quantitative, copy, deinterpolateLinear as deinterpolate} from "./quantitative";
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
        k = tickStep(d[0], d[i], count == null ? 10 : count);
    if (k) {
      d[0] = Math.floor(d[0] / k) * k;
      d[i] = Math.ceil(d[i] / k) * k;
      domain(d);
    }
    return scale;
  };

  return scale;
};

export default function linear() {
  var scale = quantitative(deinterpolate, reinterpolate);

  scale.copy = function() {
    return copy(scale, linear());
  };

  return linearish(scale);
};
