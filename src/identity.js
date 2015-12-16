import {ticks} from "d3-array";
import {map, slice} from "./array";
import number from "./number";
import tickFormat from "./tickFormat";

function identity(domain) {

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
    return identity(domain);
  };

  return scale;
}

export default function() {
  return identity([0, 1]);
};
