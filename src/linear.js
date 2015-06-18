import {bisect} from "d3-arrays";
import {interpolate, interpolateNumber, interpolateRound} from "d3-interpolate";
import nice from "./nice";
import tickFormat from "./tickFormat";
import ticks from "./ticks";
import uninterpolateClamp from "./uninterpolateClamp";
import uninterpolateNumber from "./uninterpolateNumber";

function bilinear(domain, range, uninterpolate, interpolate) {
  var u = uninterpolate(domain[0], domain[1]),
      i = interpolate(range[0], range[1]);
  return function(x) {
    return i(u(x));
  };
}

function polylinear(domain, range, uninterpolate, interpolate) {
  var k = Math.min(domain.length, range.length) - 1,
      u = new Array(k),
      i = new Array(k),
      j = -1;

  // Handle descending domains.
  if (domain[k] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++j < k) {
    u[j] = uninterpolate(domain[j], domain[j + 1]);
    i[j] = interpolate(range[j], range[j + 1]);
  }

  return function(x) {
    var j = bisect(domain, x, 1, k) - 1;
    return i[j](u[j](x));
  };
}

function newLinear(domain, range, interpolate, clamp) {
  var output,
      input;

  function rescale() {
    var linear = Math.min(domain.length, range.length) > 2 ? polylinear : bilinear,
        uninterpolate = clamp ? uninterpolateClamp : uninterpolateNumber;
    output = linear(domain, range, uninterpolate, interpolate);
    input = linear(range, domain, uninterpolate, interpolateNumber);
    return scale;
  }

  function scale(x) {
    return output(x);
  }

  scale.invert = function(y) {
    return input(y);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    for (var i = 0, n = x.length; i < n; ++i) x[i] = +x[i];
    domain = x;
    return rescale();
  };

  scale.range = function(x) {
    if (!arguments.length) return range;
    range = x;
    return rescale();
  };

  scale.rangeRound = function(x) {
    return scale.range(x).interpolate(interpolateRound);
  };

  scale.clamp = function(x) {
    if (!arguments.length) return clamp;
    clamp = !!x;
    return rescale();
  };

  scale.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x;
    return rescale();
  };

  scale.ticks = function(count) {
    return ticks(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain, count, specifier);
  };

  scale.nice = function(count) {
    nice(domain, count);
    return rescale();
  };

  scale.copy = function() {
    return newLinear(domain, range, interpolate, clamp);
  };

  return rescale();
}

export default function() {
  return newLinear([0, 1], [0, 1], interpolate, false);
};
