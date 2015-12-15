import {value, number as reinterpolate} from "d3-interpolate";
import nice from "./nice";
import {default as quantitative, deinterpolateLinear as deinterpolate} from "./quantitative";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

function linear(scale) {
  var copy = scale.copy;

  scale.ticks = function(count) {
    return ticks(scale.domain(), count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(scale.domain(), count, specifier);
  };

  scale.nice = function(count) {
    var domain = scale.domain();
    return scale.domain(nice(domain, tickRange(domain, count)[2]));
  };

  scale.copy = function() {
    return linear(copy());
  };

  return scale;
}

export default function() {
  return linear(quantitative([0, 1], [0, 1], deinterpolate, reinterpolate, value, false));
};
