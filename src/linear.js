import {number as reinterpolate} from "d3-interpolate";
import nice from "./nice";
import {default as quantitative, copy, deinterpolateLinear as deinterpolate} from "./quantitative";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

export default function linear() {
  var scale = quantitative(deinterpolate, reinterpolate),
      domain = scale.domain;

  scale.ticks = function(count) {
    return ticks(domain(), count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    var d = domain(),
        k = tickRange(d, count)[2];
    return k ? domain(nice(d,
        function(x) { return Math.floor(x / k) * k; },
        function(x) { return Math.ceil(x / k) * k; })) : scale;
  };

  scale.copy = function() {
    return copy(scale, linear());
  };

  return scale;
};
