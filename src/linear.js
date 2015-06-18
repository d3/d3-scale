import {
  range
} from "d3-arrays";

import {
  interpolate,
  interpolateNumber,
  interpolateRound
} from "d3-interpolate";

import {
  format,
  formatPrefix,
  formatSpecifier,
  precisionFixed,
  precisionPrefix,
  precisionRound
} from "d3-format";

import extent from "./extent";
import bilinear from "./bilinear";
import polylinear from "./polylinear";
import uninterpolateClamp from "./uninterpolateClamp";
import uninterpolateNumber from "./uninterpolateNumber";

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

  // Note: requires range is coercible to number!
  scale.invert = function(y) {
    return input(y);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x.map(Number);
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
    clamp = x;
    return rescale();
  };

  scale.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x;
    return rescale();
  };

  scale.ticks = function(count) {
    return linearTicks(domain, count);
  };

  scale.tickFormat = function(count, specifier) {
    return linearTickFormat(domain, count, specifier);
  };

  scale.nice = function(count) {
    linearNice(domain, count);
    return rescale();
  };

  scale.copy = function() {
    return newLinear(domain, range, interpolate, clamp);
  };

  return rescale();
}

function linearNice(domain, count) {
  return nice(domain, niceStep(linearTickRange(domain, count)[2]));
}

function linearTicks(domain, count) {
  return range.apply(null, linearTickRange(domain, count));
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function linearTickRange(domain, count) {
  if (count == null) count = 10;
  domain = extent(domain);

  var span = domain[1] - domain[0],
      step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
      error = span / count / step;

  // Filter ticks to get closer to the desired count.
  if (error >= e10) step *= 10;
  else if (error >= e5) step *= 5;
  else if (error >= e2) step *= 2;

  // Round start and stop values to step interval.
  // TODO This rounding duplicates code with nice. Sort of.
  domain[0] = Math.ceil(domain[0] / step) * step;
  domain[1] = Math.floor(domain[1] / step) * step + step * .5; // inclusive
  domain[2] = step;
  return domain;
}

function linearTickFormat(domain, count, specifier) {
  var range = linearTickRange(domain, count);
  if (specifier == null) {
    specifier = ",." + precisionFixed(range[2]) + "f";
  } else {
    switch (specifier = formatSpecifier(specifier), specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
        if (specifier.precision == null) specifier.precision = precisionPrefix(range[2], value);
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null) specifier.precision = precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null) specifier.precision = precisionFixed(range[2]) - (specifier.type === "%") * 2;
        break;
      }
    }
  }
  return format(specifier);
}

export default function() {
  return newLinear([0, 1], [0, 1], interpolate, false);
};
