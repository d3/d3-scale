import linear, {rebind} from "./linear";
import nice from "./nice";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

function newPow(linear, exponent, domain) {

  function powp(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function powb(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  }

  function scale(x) {
    return linear(powp(x));
  }

  scale.invert = function(x) {
    return powb(linear.invert(x));
  };

  scale.exponent = function(x) {
    if (!arguments.length) return exponent;
    exponent = +x;
    return scale.domain(domain);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    linear.domain(domain.map(powp));
    return scale;
  };

  scale.ticks = function(count) {
    return ticks(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain, count, specifier);
  };

  scale.nice = function(count) {
    return scale.domain(nice(domain, tickRange(domain, count)[2]));
  };

  scale.copy = function() {
    return newPow(linear.copy(), exponent, domain);
  };

  return rebind(scale, linear);
}

export function sqrt() {
  return newPow(linear(), .5, [0, 1]);
};

export default function() {
  return newPow(linear(), 1, [0, 1]);
};
