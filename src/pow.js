import {linearish} from "./linear";
import {default as continuous, copy} from "./continuous";

export default function pow() {
  var exponent = 1,
      scale = continuous(transform),
      domain = scale.domain;

  function transform(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  transform.invert = function(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  };

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return linearish(scale);
}

export function sqrt() {
  return pow().exponent(0.5);
}
