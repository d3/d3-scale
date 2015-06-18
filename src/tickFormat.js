import {
  format,
  formatPrefix,
  formatSpecifier,
  precisionFixed,
  precisionPrefix,
  precisionRound
} from "d3-format";

import {tickRange} from "./ticks";

export default function(domain, count, specifier) {
  var range = tickRange(domain, count);
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
};
