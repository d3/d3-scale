import {identity} from "./continuous";
import {linearish} from "./linear";
import {loggish} from "./log";
import {powish} from "./pow";

function transformer(interpolator) {
  var x0 = 0,
      x1 = 0.5,
      x2 = 1,
      t0,
      t1,
      t2,
      k10,
      k21,
      transform,
      clamp = false;

  function scale(x) {
    var t = 0.5 + ((x = +transform(x)) - t1) * (x < t1 ? k10 : k21);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), t2 = transform(x2 = +_[2]), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), scale) : [x0, x1, x2];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  return function(t) {
    transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1);
    return scale;
  };
}

export default function diverging(interpolator) {
  var scale = linearish(transformer(interpolator)(identity));

  scale.copy = function() {
    return diverging(scale.interpolator())
        .domain(scale.domain())
        .clamp(scale.clamp());
  };

  return scale;
}

export function divergingLog(interpolator, base) {
  var scale = loggish(transformer(interpolator)).domain([0.1, 1, 10]);

  scale.copy = function() {
    return divergingLog(scale.interpolator(), scale.base())
        .domain(scale.domain())
        .clamp(scale.clamp());
  };

  return base === undefined ? scale : scale.base(base);
}

export function divergingPow(interpolator, exponent) {
  var scale = powish(transformer(interpolator));

  scale.copy = function() {
    return divergingPow(scale.interpolator(), scale.exponent())
        .domain(scale.domain())
        .clamp(scale.clamp());
  };

  return exponent === undefined ? scale : scale.exponent(exponent);
}

export function divergingSqrt(interpolator) {
  return divergingPow(interpolator, 0.5);
}
