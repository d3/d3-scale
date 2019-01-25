import {identity} from "./continuous";
import {linearish} from "./linear";
import {loggish} from "./log";
import {symlogTransform} from "./symlog";
import {powish} from "./pow";

function transformer(interpolator) {
  var x0 = 0,
      x1 = 1,
      t0,
      t1,
      k10,
      transform,
      clamp = false;

  if (interpolator == null) interpolator = identity;

  function scale(x) {
    var t = (transform(x) - t0) * k10;
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  return function(t) {
    transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
    return scale;
  };
}

export function copy(source, target) {
  return target
      .domain(source.domain())
      .interpolator(source.interpolator())
      .clamp(source.clamp());
}

export default function sequential(interpolator) {
  var scale = linearish(transformer(interpolator)(identity));
  scale.copy = function() { return copy(scale, sequential()); };
  return scale;
}

export function sequentialLog(interpolator) {
  var scale = loggish(transformer(interpolator)).domain([1, 10]);
  scale.copy = function() { return copy(scale, sequentialLog()).base(scale.base()); };
  return scale;
}

export function sequentialSymlog(interpolator) {
  var scale = linearish(transformer(interpolator)(symlogTransform));
  scale.copy = function() { return copy(scale, sequentialSymlog()); };
  return scale;
}

export function sequentialPow(interpolator) {
  var scale = powish(transformer(interpolator));
  scale.copy = function() { return copy(scale, sequentialPow()).exponent(scale.exponent()); };
  return scale;
}

export function sequentialSqrt(interpolator) {
  return sequentialPow(interpolator).exponent(0.5);
}
