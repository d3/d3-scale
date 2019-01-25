import {linearish} from "./linear";
import continuous, {copy} from "./continuous";

function transformSymlog(x) {
  return x < -1 ? -Math.log(-x) - 1 : x > 1 ? Math.log(x) + 1 : x;
}

transformSymlog.invert = function(x) {
  return x < -1 ? -Math.exp(-x - 1) : x > 1 ? Math.exp(x - 1) : x;
};

export default function symlog() {
  var scale = continuous(transformSymlog);

  scale.copy = function() {
    return copy(scale, symlog());
  };

  return linearish(scale);
}
