import {interpolate, interpolateRound, piecewise} from "d3-interpolate";
import {identity} from "./continuous.js";
import {initInterpolator} from "./init.js";
import {linearish} from "./linear.js";
import {loggish} from "./log.js";
import {copy} from "./sequential.js";
import {symlogish} from "./symlog.js";
import {powish} from "./pow.js";

function transformer() {
  let x0 = 0;
  let x1 = 0.5;
  let x2 = 1;
  let s = 1;
  let t0;
  let t1;
  let t2;
  let k10;
  let k21;
  let interpolator = identity;
  let transform;
  let clamp = false;
  let unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform(x)) - t1) * (s * x < s * t1 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
  }

  scale.domain = function(_) {
    return arguments.length ? ([x0, x1, x2] = _, t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), t2 = transform(x2 = +x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1, scale) : [x0, x1, x2];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  function range(interpolate) {
    return function(_) {
      let r0;
      let r1;
      let r2;
      return arguments.length ? ([r0, r1, r2] = _, interpolator = piecewise(interpolate, [r0, r1, r2]), scale) : [interpolator(0), interpolator(0.5), interpolator(1)];
    };
  }

  scale.range = range(interpolate);

  scale.rangeRound = range(interpolateRound);

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function(t) {
    transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1;
    return scale;
  };
}

export default function diverging() {
  const scale = linearish(transformer()(identity));

  scale.copy = function() {
    return copy(scale, diverging());
  };

  return initInterpolator.apply(scale, arguments);
}

export function divergingLog() {
  const scale = loggish(transformer()).domain([0.1, 1, 10]);

  scale.copy = function() {
    return copy(scale, divergingLog()).base(scale.base());
  };

  return initInterpolator.apply(scale, arguments);
}

export function divergingSymlog() {
  const scale = symlogish(transformer());

  scale.copy = function() {
    return copy(scale, divergingSymlog()).constant(scale.constant());
  };

  return initInterpolator.apply(scale, arguments);
}

export function divergingPow() {
  const scale = powish(transformer());

  scale.copy = function() {
    return copy(scale, divergingPow()).exponent(scale.exponent());
  };

  return initInterpolator.apply(scale, arguments);
}

export function divergingSqrt() {
  return divergingPow.apply(null, arguments).exponent(0.5);
}
