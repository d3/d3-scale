import {linearish} from "./linear";
import continuous, {copy} from "./continuous";

export function symlogTransform(x) {
  return x < -1 ? -Math.log(-x) - 1 : x > 1 ? Math.log(x) + 1 : x;
}

function symlogUntransform(x) {
  return x < -1 ? -Math.exp(-x - 1) : x > 1 ? Math.exp(x - 1) : x;
}

export default function symlog() {
  var scale = continuous(symlogTransform, symlogUntransform);

  scale.copy = function() {
    return copy(scale, symlog());
  };

  return linearish(scale);
}
