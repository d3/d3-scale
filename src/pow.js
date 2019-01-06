import {linearish} from "./linear";
import {default as continuous, copy} from "./continuous";
import transformIdentity from "./transform/identity";
import transformPow from "./transform/pow";
import transformSqrt from "./transform/sqrt";

export default function pow(exponent) {
  var scale = continuous(transform(exponent = exponent === undefined ? 1 : +exponent));

  scale.exponent = function(_) {
    return arguments.length ? scale.transform(transform(exponent = +_)) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow(exponent));
  };

  return linearish(scale);
}

export function sqrt() {
  return pow(0.5);
}

function transform(exponent) {
  return exponent === 1 ? transformIdentity
      : exponent === 0.5 ? transformSqrt
      : transformPow(exponent);
}
