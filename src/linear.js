import {
  range
} from "d3-arrays";

import {
  interpolate,
  interpolateNumber,
  interpolateRound
} from "d3-interpolate";

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

  scale.ticks = function(m) {
    return linearTicks(domain, m);
  };

  // TODO
  // scale.tickFormat = function(m, format) {
  //   return tickFormat(domain, m, format);
  // };

  scale.nice = function(m) {
    linearNice(domain, m);
    return rescale();
  };

  scale.copy = function() {
    return newLinear(domain, range, interpolate, clamp);
  };

  return rescale();
}

function linearNice(domain, m) {
  return nice(domain, niceStep(linearTickRange(domain, m)[2]));
}

function linearTicks(domain, m) {
  return range.apply(null, linearTickRange(domain, m));
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function linearTickRange(domain, m) {
  if (m == null) m = 10;
  domain = extent(domain);

  var span = domain[1] - domain[0],
      step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
      error = span / m / step;

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

// function linearTickFormat(domain, m, format) {
//   var range = linearTickRange(domain, m);
//   if (format) {
//     var match = d3_format_re.exec(format);
//     match.shift();
//     if (match[8] === "s") {
//       var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
//       if (!match[7]) match[7] = "." + linearPrecision(prefix.scale(range[2]));
//       match[8] = "f";
//       format = d3.format(match.join(""));
//       return function(d) {
//         return format(prefix.scale(d)) + prefix.symbol;
//       };
//     }
//     if (!match[7]) match[7] = "." + linearFormatPrecision(match[8], range);
//     format = match.join("");
//   } else {
//     format = ",." + linearPrecision(range[2]) + "f";
//   }
//   return d3.format(format);
// }

// var linearFormatSignificant = {s: 1, g: 1, p: 1, r: 1, e: 1};

// // Returns the number of significant digits after the decimal point.
// function linearPrecision(value) {
//   return -Math.floor(Math.log(value) / Math.LN10 + .01);
// }

// // For some format types, the precision specifies the number of significant
// // digits; for others, it specifies the number of digits after the decimal
// // point. For significant format types, the desired precision equals one plus
// // the difference between the decimal precision of the range’s maximum absolute
// // value and the tick step’s decimal precision. For format "e", the digit before
// // the decimal point counts as one.
// function linearFormatPrecision(type, range) {
//   var p = linearPrecision(range[2]);
//   return type in linearFormatSignificant
//       ? Math.abs(p - linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e")
//       : p - (type === "%") * 2;
// }

export default function() {
  return newLinear([0, 1], [0, 1], interpolate, false);
};
