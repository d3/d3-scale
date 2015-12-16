import constant from "./constant";
import {linearish} from "./linear";
import {default as quantitative, copy} from "./quantitative";

function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

export default function pow() {
  var exponent = 1,
      scale = quantitative(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (a = raise(a, exponent), b = raise(b, exponent) - a)
        ? function(x) { return (raise(x, exponent) - a) / b; }
        : constant(isNaN(b) ? NaN : 0);
  }

  function reinterpolate(a, b) {
    return a = raise(a, exponent), b = raise(b, exponent) - a, function(t) {
      return raise(a + b * t, 1 / exponent);
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
