import {range as sequence} from "d3-array";
import ordinal from "./ordinal";

export default function ordinalPoint() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      range = scale.range,
      extent = [0, 1],
      step = 0,
      round = false,
      padding = 0;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = extent[1] < extent[0],
        start = extent[reverse - 0],
        stop = extent[1 - reverse];
    step = n < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (n - 1 + padding);
    if (round) step = Math.floor(step), start = Math.round(start + step * padding / 2 + (stop - start - (n - 1 + padding) * step) / 2);
    else start += step * padding / 2;
    var values = sequence(n).map(function(i) { return start + step * i; });
    return range(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (extent = [+_[0], +_[1]], rescale()) : extent.slice();
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (padding = +_, rescale()) : padding;
  };

  scale.copy = function() {
    return ordinalBand().domain(domain).range(range).round(round).padding(padding);
  };

  return scale;
};
