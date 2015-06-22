import tickFormat from "./tickFormat";
import ticks from "./ticks";

function newIdentity(domain) {

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    return scale;
  };

  scale.ticks = function(count) {
    return ticks(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain, count, specifier);
  };

  scale.copy = function() {
    return newIdentity(domain);
  };

  return scale;
}

export default function() {
  return newIdentity([0, 1]);
};
