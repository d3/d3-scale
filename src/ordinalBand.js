import ordinal from "./ordinal";

function steps(length, start, step) {
  var steps = new Array(length), i = -1;
  while (++i < length) steps[i] = start + step * i;
  return steps;
}

export default function ordinalBand() {
  var scale = ordinal().range([], undefined),
      domain = scale.domain,
      range = scale.range,
      rangeExtent = [0, 1],
      rangeBand = 0,
      round = false,
      paddingInner = 0,
      paddingOuter = 0;

  function rescale() {
    var n = domain().length,
        reverse = rangeExtent[1] < rangeExtent[0],
        start = rangeExtent[reverse - 0],
        stop = rangeExtent[1 - reverse],
        step = (stop - start) / (n - paddingInner + 2 * paddingOuter);
    if (round) step = Math.floor(step), start = Math.round(start + (stop - start - (n - paddingInner) * step) / 2);
    else start += step * paddingOuter;
    var rangeValues = steps(n, start, step);
    rangeBand = step * (1 - paddingInner);
    if (round) rangeBand = Math.round(rangeBand);
    return range(reverse ? rangeValues.reverse() : rangeValues);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (rangeExtent = [+_[0], +_[1]], rescale()) : rangeExtent.slice();
  };

  scale.rangeBand = function() {
    return rangeBand;
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
    return ordinalBand().domain(domain).range(range).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter);
  };

  return scale;
};
