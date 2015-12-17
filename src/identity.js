import {ticks} from "d3-array";
import {map, slice} from "./array";
import number from "./number";
import tickFormat from "./tickFormat";

export default function identity() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map.call(_, number), scale) : domain.slice();
  };

  scale.ticks = function(count) {
    return ticks(domain[0], domain[domain.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain, count, specifier);
  };

  scale.copy = function() {
    return identity().domain(domain);
  };

  return scale;
};
