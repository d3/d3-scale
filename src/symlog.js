import {ascending, descending, tickStep} from "d3-array";
import {format, formatSpecifier} from "d3-format";
import {linearish} from "./linear.js";
import {copy, transformer} from "./continuous.js";
import {initRange} from "./init.js";

function transformSymlog(c) {
  return function(x) {
    return Math.sign(x) * Math.log1p(Math.abs(x / c));
  };
}

function transformSymexp(c) {
  return function(x) {
    return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
  };
}

export function symlogish(transform) {
  var c = 1, scale = transform(transformSymlog(c), transformSymexp(c));

  scale.constant = function(_) {
    return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
  };

  linearish(scale);

  scale.ticks = function (count) {
    const domain = scale.domain();
    const [min, max] = scale.range().sort(ascending);
    const n = count == null ? 10 : +count;
    const extent = max - min;
    if (n <= 0 || !extent || !isFinite(extent)) return [];
    let ticks;
    if (domain[0] * domain[1] > 0) {
      ticks = niceTicks(scale, min, max, n, extent);
    } else {
      const origin = scale(0);
      const n0 = Math.round((n * (origin - min)) / extent);
      ticks = [
        ...niceTicks(scale, min, origin, n0, extent),
        0,
        ...niceTicks(scale, origin, max, n - n0, extent),
      ];
    }
    return ticks.sort(domain[0] < domain[1] ? ascending : descending);
  };

  scale.tickFormat = function (_count, specifier) {
    if (specifier == null) specifier = "s";
    if (typeof specifier !== "function") {
      specifier = formatSpecifier(specifier);
      if (specifier.precision == null) specifier.trim = true;
      specifier = format(specifier);
    }
    return specifier;
  };

  return scale;
}

function niceTicks(scale, start, stop, n, span) {
  if (!n || stop === start) return [];
  const spacing = (stop - start) / n;
  const h = Math.min(spacing / 2, span / 20); // cap to avoid degenerate rounding at low counts
  const ticks = new Set();
  for (let i = 0; i <= n; ++i) {
    const pi = start + i * spacing;
    const v = scale.invert(pi);
    const step = Math.abs(scale.invert(pi + h) - scale.invert(pi - h));
    const s = tickStep(0, step / 2, 2);
    ticks.add(s ? Math.round(v / s) * s : v);
  }
  ticks.delete(0);
  return [...ticks];
}

export default function symlog() {
  var scale = symlogish(transformer());

  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };

  return initRange.apply(scale, arguments);
}
