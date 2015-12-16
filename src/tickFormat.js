import {tickStep} from "d3-array";
import {format, formatPrefix, formatSpecifier, precisionFixed, precisionPrefix, precisionRound} from "d3-format";

export default function(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = tickStep(start, stop, count == null ? 10 : count);
  if (specifier == null) {
    specifier = ",." + precisionFixed(step) + "f";
  } else {
    switch (specifier = formatSpecifier(specifier), specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null) specifier.precision = precisionPrefix(step, value);
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null) specifier.precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))) - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null) specifier.precision = precisionFixed(step) - (specifier.type === "%") * 2;
        break;
      }
    }
  }
  return format(specifier);
};
