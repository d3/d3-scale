import {linearish} from "./linear";
import {transformer, copy} from "./continuous";

function transformExponent(exponent) {
  return exponent === 1 ? undefined
      : exponent === 0.5 ? transformSqrt
      : transformPow(exponent);
}

function transformPow(exponent) {

  function pow(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  pow.invert = function(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  };

  return pow;
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

transformSqrt.invert = function(x) {
  return x < 0 ? -x * x : x * x;
};

export default function pow(exponent) {
  var transform = transformer(),
      scale = transform(transformExponent(exponent = exponent === undefined ? 1 : +exponent));

  scale.exponent = function(_) {
    return arguments.length ? transform(transformExponent(exponent = +_)) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow(exponent));
  };

  return linearish(scale);
}

export function sqrt() {
  return pow(0.5);
}
