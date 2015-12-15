import {value, number as reinterpolate} from "d3-interpolate";
import nice from "./nice";
import {default as quantitative, deinterpolateLinear as deinterpolate} from "./quantitative";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

function linear(scale) {
  var copy = scale.copy,
      domain = scale.domain;

  scale.ticks = function(count) {
    return ticks(domain(), count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    var d = domain();
    return domain(nice(d, tickRange(d, count)[2]));
  };

  scale.copy = function() {
    return linear(copy());
  };

  return scale;
}

export default function() {
  return linear(quantitative([0, 1], [0, 1], deinterpolate, reinterpolate, value, false));
};
