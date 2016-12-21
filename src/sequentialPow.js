import {linearish} from "./linear";
import {raise} from "./pow";

export default function sequentialPow(interpolator) {
  var exponent = 1,
      x0 = 0, p0 = raise(x0, exponent),
      x1 = 1, p1 = raise(x1, exponent),
      clamp = false;

  function scale(x) {
    var t = (raise(x, exponent) - p0) / (p1 - p0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.exponent = function(_) {
    return arguments.length ? (p0 = raise(x0, exponent = +_), p1 = raise(x1, exponent), scale) : exponent;
  };

  scale.domain = function(_) {
    return arguments.length ? (p0 = raise(x0 = +_[0], exponent), p1 = raise(x1 = +_[1], exponent), scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function() {
    return sequentialPow(interpolator).exponent(exponent).domain([x0, x1]).clamp(clamp);
  };

  return linearish(scale);
}

export function sequentialSqrt(interpolator) {
  return sequentialPow(interpolator).exponent(0.5);
}
