import constant from "./constant";
import nice from "./nice";
import {default as quantitative, copy} from "./quantitative";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

export default function pow() {
  var exponent = 1,
      scale = quantitative(deinterpolate, reinterpolate),
      domain = scale.domain;

  function raise(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function lower(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  }

  function deinterpolate(a, b) {
    return (b = raise(b) - (a = raise(a)))
        ? function(x) { return (raise(x) - a) / b; }
        : constant(isNaN(b) ? NaN : 0);
  }

  function reinterpolate(a, b) {
    return b = raise(b) - (a = raise(a)), function(t) {
      return lower(a + b * t);
    };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  // TODO Don’t duplicate linear implementation.
  scale.ticks = function(count) {
    return ticks(domain(), count);
  };

  // TODO Don’t duplicate linear implementation.
  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  // TODO Don’t duplicate linear implementation.
  scale.nice = function(count) {
    var d = domain(),
        k = tickRange(d, count)[2];
    return k ? domain(nice(d,
        function(x) { return Math.floor(x / k) * k; },
        function(x) { return Math.ceil(x / k) * k; })) : scale;
  };

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return scale;
};

export function sqrt() {
  return pow().exponent(0.5);
};
