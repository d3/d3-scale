import {linearish} from "./linear";
import {transformer, copy} from "./continuous";

function transformPow(exponent) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

function transformSquare(x) {
  return x < 0 ? -x * x : x * x;
}

export default function pow(exponent) {
  var transform = transformer(),
      scale = retransform(exponent = exponent === undefined ? 1 : +exponent);

  function retransform(exponent) {
    return exponent === 1 ? transform()
        : exponent === 0.5 ? transform(transformSqrt, transformSquare)
        : transform(transformPow(exponent), transformPow(1 / exponent));
  }

  scale.exponent = function(_) {
    return arguments.length ? retransform(exponent = +_) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow(exponent));
  };

  return linearish(scale);
}

export function sqrt() {
  return pow(0.5);
}
