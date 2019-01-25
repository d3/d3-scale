import {linearish} from "./linear";
import {copy, transformer} from "./continuous";

function transformSymlog(C) {
  return function(x) {
    return Math.sign(x) * Math.log10(1 + Math.abs(x / C));
  };
}

function transformSymexp(C) {
  return function(x) {
    return Math.sign(x) * C * (Math.pow(10, Math.abs(x)) - 1);
  };
}

export function symlogish(transform) {
  var C = 1 / Math.log(10),
      scale = transform(transformSymlog(C), transformSymexp(C));

  scale.constant = function(_) {
    return arguments.length ? transform(transformSymlog(C = +_), transformSymexp(C)) : C;
  };

  return linearish(scale);
}

export default function symlog() {
  var scale = symlogish(transformer());

  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };

  return scale;
}
