import {map} from "./array";
import {linearish} from "./linear";
import number from "./number";

export default function identity(domain) {

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map.call(_, number), scale) : domain.slice();
  };

  scale.copy = function() {
    return identity(domain);
  };

  domain = arguments.length ? map.call(domain, number) : [0, 1];

  return linearish(scale);
}
