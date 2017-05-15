import constant from "./constant";
import {linearish} from "./linear";
import {logp, powp} from "./log";
import {default as continuous, copy, deinterpolateLinear} from "./continuous";

export default function exp() {
  var base = Math.E,
      log = logp(base),
      pow = powp(base),
      scale = continuous(deinterpolate, interpolate).range([1, base]),
      domain = scale.domain;

  function rescale() {
    log = logp(base);
    pow = powp(base);
    return scale;
  }

  function deinterpolate(a, b) {
    a = pow(a);
    b = pow(b) - a;
    if (!b) return constant(b);
    return function(x) {
      return (pow(x) - a) / b;
    };
  }

  function interpolate(a, b) {
    a = pow(a);
    b = pow(b) - a;
    return function(t) {
      return log(b * t + a);
    };
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.copy = function() {
    return copy(scale, exp().base(base));
  };

  return linearish(scale);
};
