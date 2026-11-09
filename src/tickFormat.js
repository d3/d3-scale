import {tickStep} from "d3-array";
import {format, formatPrefix, formatSpecifier, precisionFixed, precisionPrefix, precisionRound} from "d3-format";

export default function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count);
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null) setPrecision(specifier, precisionPrefix(step, value));
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null) setPrecision(specifier, precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))) - (specifier.type === "e"));
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null) setPrecision(specifier, precisionFixed(step) - (specifier.type === "%") * 2);
      break;
    }
  }
  return format(specifier);
}

// If no precision can be derived from the step (e.g., the domain is a single
// value), trim insignificant trailing zeros instead.
function setPrecision(specifier, precision) {
  if (isNaN(precision)) specifier.trim = true;
  else specifier.precision = precision;
}
