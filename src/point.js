import {range as sequence} from "d3-array";
import ordinal from "./ordinal";

export default function point() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step = 0,
      round = false,
      padding = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = n < 2 ? (start = (start + stop) * align, 0) : (stop - start) / (n - 1 + padding * 2);
    if (round) step = Math.floor(step), start = Math.round(start + (stop - start - (n - 1) * step) * align);
    else start += step * padding * 2 * align;
    var values = sequence(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = [+_[0], +_[1]], round = true, rescale();
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

  scale.align = function(_) {
    return arguments.length ? (align = +_, rescale()) : align;
  };

  scale.copy = function() {
    return point()
        .domain(domain())
        .range(extent)
        .round(round)
        .padding(padding)
        .align(align);
  };

  return scale;
};
