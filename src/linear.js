import {bisect} from "d3-arrays";
import {interpolate, interpolateNumber, interpolateRound} from "d3-interpolate";
import nice from "./nice";
import tickFormat from "./tickFormat";
import ticks, {tickRange} from "./ticks";

function uninterpolateClamp(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return Math.max(0, Math.min(1, (x - a) / b));
  };
}

function uninterpolateNumber(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return (x - a) / b;
  };
}

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
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    return rescale();
  };

  scale.range = function(x) {
    if (!arguments.length) return range.slice();
    range = x.slice();
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
    domain = nice(domain, tickRange(domain, count)[2]);
    return rescale();
  };

  scale.copy = function() {
    return newLinear(domain, range, interpolate, clamp);
  };

  return rescale();
}

export function rebind(scale, linear) {
  scale.range = function() {
    var x = linear.range.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.rangeRound = function() {
    var x = linear.rangeRound.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.clamp = function() {
    var x = linear.clamp.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  scale.interpolate = function() {
    var x = linear.interpolate.apply(linear, arguments);
    return x === linear ? scale : x;
  };

  return scale;
};

export default function() {
  return newLinear([0, 1], [0, 1], interpolate, false);
};
