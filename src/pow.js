import linear from "./linear";
import nice from "./nice";
import tickFormat from "./tickFormat";
import ticks from "./ticks";

function newPow(linear, exponent, domain) {

  function scale(x) {
    return linear(powp(x));
  }

  function powp(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function powb(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  }

  scale.invert = function(x) {
    return powb(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    linear.domain(domain.map(powp));
    return scale;
  };

  scale.range = function() {
    var x = linear.range.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.rangeRound = function() {
    var x = linear.rangeRound.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.clamp = function() {
    var x = linear.clamp.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.interpolate = function() {
    var x = linear.interpolate.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.ticks = function(count) {
    return ticks(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain, count, specifier);
  };

  scale.nice = function(count) {
    return scale.domain(nice(domain, count));
  };

  scale.exponent = function(x) {
    if (!arguments.length) return exponent;
    exponent = +x;
    return scale.domain(domain);
  };

  scale.copy = function() {
    return newPow(linear.copy(), exponent, domain);
  };

  return scale;
}

export function sqrt() {
  return newPow(linear(), .5, [0, 1]);
};

export default function() {
  return newPow(linear(), 1, [0, 1]);
};
