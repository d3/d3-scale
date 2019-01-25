import {powish} from "./pow";
import {transformer} from "./sequential";

export default function sequentialPow(interpolator, exponent) {
  var scale = powish(transformer(interpolator));

  scale.copy = function() {
    return sequentialPow(scale.interpolator(), scale.exponent())
        .domain(scale.domain())
        .clamp(scale.clamp());
  };

  return exponent === undefined ? scale : scale.exponent(exponent);
}

export function sequentialSqrt(interpolator) {
  return sequentialPow(interpolator, 0.5);
}
