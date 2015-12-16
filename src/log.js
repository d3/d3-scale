import {format} from "d3-format";
import constant from "./constant";
import nice from "./nice";
import {default as quantitative, copy} from "./quantitative";

var tickFormat10 = format(".0e"),
    tickFormatOther = format(",");

function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : constant(isNaN(b) ? NaN : 0);
}

function reinterpolate(a, b) {
  return a < 0
      ? function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); }
      : function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); };
}

export default function log() {
  var scale = quantitative(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      interval = {floor: function(x) { return pow(Math.floor(log(x))); }, ceil: function(x) { return pow(Math.ceil(log(x))); }},
      log,
      pow;

  function rescale() {
    var d = domain(),
        k = Math.log(base);

    if (d[0] < 0) {
      log = function(x) { return -Math.log(-x) / k; };
      pow = function(x) { return -Math.pow(base, -x); };
    } else {
      log = function(x) { return Math.log(x) / k; };
      pow = function(x) { return Math.pow(base, x); };
    }

    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.nice = function() {
    return domain(nice(domain(), interval)), rescale();
  };

  scale.ticks = function() {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1];

    if (v < u) i = u, u = v, v = i;

    var i = Math.floor(log(u)),
        j = Math.ceil(log(v)),
        p,
        k,
        t,
        n = base % 1 ? 2 : base,
        ticks = [];

    if (isFinite(j - i)) {
      if (u > 0) {
        for (--j, k = 1, p = pow(i); k < n; ++k) if ((t = p * k) < u) continue; else ticks.push(t);
        while (++i < j) for (k = 1, p = pow(i); k < n; ++k) ticks.push(p * k);
        for (k = 1, p = pow(i); k <= n; ++k) if ((t = p * k) > v) break; else ticks.push(t);
      } else {
        for (++i, k = n, p = pow(i); k >= 1; --k) if ((t = p * k) < u) continue; else ticks.push(t);
        while (++i < j) for (k = n - 1, p = pow(i); k >= 1; --k) ticks.push(p * k);
        for (k = n - 1, p = pow(i); k >= 1; --k) if ((t = p * k) > v) break; else ticks.push(t);
      }
    }

    return ticks;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? tickFormat10 : tickFormatOther;
    else if (typeof specifier !== "function") specifier = format(specifier);
    if (count == null) return specifier;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pow(Math.round(log(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.copy = function() {
    return copy(scale, log().base(base));
  };

  return rescale();
};
