import constant from "./constant";
import {linearish} from "./linear";
import {default as quantitative, copy} from "./quantitative";

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

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return linearish(scale);
};

export function sqrt() {
  return pow().exponent(0.5);
};
