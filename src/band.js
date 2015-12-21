import {range as sequence} from "d3-array";
import ordinal from "./ordinal";

export default function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step = 0,
      round = false,
      paddingInner = 0,
      paddingOuter = 0;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse],
        step = (stop - start) / (n - paddingInner + 2 * paddingOuter);
    if (round) step = Math.floor(step), start = Math.round(start + (stop - start - (n - paddingInner) * step) / 2);
    else start += step * paddingOuter;
    var values = sequence(n).map(function(i) { return start + step * i; });
    step *= 1 - paddingInner;
    if (round) step = Math.round(step);
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

  scale.band = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = paddingOuter = +_, rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = +_, rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.copy = function() {
    return band()
        .domain(domain())
        .range(extent)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter);
  };

  return scale;
};
