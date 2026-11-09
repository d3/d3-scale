import {tickStep} from "d3-array";
import {format, formatPrefix, formatSpecifier, precisionFixed, precisionPrefix, precisionRound} from "d3-format";

export default function tickFormat(start, stop, count, specifierIn) {
  var step = tickStep(start, stop, count),
      precision;
  const specifier = formatSpecifier(specifierIn == null ? ",f" : specifierIn);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null) {
        if (step === 0) {
          if (specifierIn == null) specifier.trim = true;
        }
        else if (!isNaN(precision = precisionFixed(step))) {
          specifier.precision = precision - (specifier.type === "%") * 2;
        }
      } 
      break;
    }
  }
  return format(specifier);
}
