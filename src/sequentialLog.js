import {loggish} from "./log";
import {transformer} from "./sequential";

export default function sequentialLog(interpolator, base) {
  var scale = loggish(transformer(interpolator));

  scale.copy = function() {
    return sequentialLog(scale.interpolator(), scale.base())
        .domain(scale.domain())
        .clamp(scale.clamp());
  };

  return base === undefined ? scale : scale.base(base);
}
