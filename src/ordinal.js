import {map} from "d3-arrays";

function steps(length, start, step) {
  var steps = new Array(length), i = -1;
  while (++i < length) steps[i] = start + step * i;
  return steps;
}

function newOrdinal(domain, ranger) {
  var index,
      range,
      rangeBand;

  function scale(x) {
    var k = x + "", i = index.get(k);
    if (!i) {
      if (ranger.t !== "range") return;
      index.set(k, i = domain.push(x));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = [];
    index = map();
    var i = -1, n = x.length, xi, xk;
    while (++i < n) if (!index.has(xk = (xi = x[i]) + "")) index.set(xk, domain.push(xi));
    return scale[ranger.t].apply(scale, ranger.a);
  };

  scale.range = function(x) {
    if (!arguments.length) return range.slice();
    range = x.slice();
    rangeBand = 0;
    ranger = {t: "range", a: arguments};
    return scale;
  };

  scale.rangePoints = function(x, padding) {
    padding = arguments.length < 2 ? 0 : +padding;
    var start = +x[0],
        stop = +x[1],
        step = domain.length < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (domain.length - 1 + padding);
    range = steps(domain.length, start + step * padding / 2, step);
    rangeBand = 0;
    ranger = {t: "rangePoints", a: arguments};
    return scale;
  };

  scale.rangeRoundPoints = function(x, padding) {
    padding = arguments.length < 2 ? 0 : +padding;
    var start = +x[0],
        stop = +x[1],
        step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 0) : (stop - start) / (domain.length - 1 + padding) | 0; // bitwise floor for symmetry
    range = steps(domain.length, start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
    rangeBand = 0;
    ranger = {t: "rangeRoundPoints", a: arguments};
    return scale;
  };

  scale.rangeBands = function(x, padding, outerPadding) {
    padding = arguments.length < 2 ? 0 : +padding;
    outerPadding = arguments.length < 3 ? padding : +outerPadding;
    var reverse = +x[1] < +x[0],
        start = +x[reverse - 0],
        stop = +x[1 - reverse],
        step = (stop - start) / (domain.length - padding + 2 * outerPadding);
    range = steps(domain.length, start + step * outerPadding, step);
    if (reverse) range.reverse();
    rangeBand = step * (1 - padding);
    ranger = {t: "rangeBands", a: arguments};
    return scale;
  };

  scale.rangeRoundBands = function(x, padding, outerPadding) {
    padding = arguments.length < 2 ? 0 : +padding;
    outerPadding = arguments.length < 3 ? padding : +outerPadding;
    var reverse = +x[1] < +x[0],
        start = +x[reverse - 0],
        stop = +x[1 - reverse],
        step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
    range = steps(domain.length, start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
    if (reverse) range.reverse();
    rangeBand = Math.round(step * (1 - padding));
    ranger = {t: "rangeRoundBands", a: arguments};
    return scale;
  };

  scale.rangeBand = function() {
    return rangeBand;
  };

  scale.rangeExtent = function() {
    var t = ranger.a[0], start = t[0], stop = t[t.length - 1];
    if (stop < start) t = stop, stop = start, start = t;
    return [start, stop];
  };

  scale.copy = function() {
    return newOrdinal(domain, ranger);
  };

  return scale.domain(domain);
}

export default function() {
  return newOrdinal([], {t: "range", a: [[]]});
};
