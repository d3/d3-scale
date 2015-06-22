import {ascending, bisect, quantile} from "d3-arrays";

function newQuantile(domain, range) {
  var thresholds;

  function rescale() {
    var k = 0,
        q = range.length;
    thresholds = [];
    while (++k < q) thresholds[k - 1] = quantile(domain, k / q);
    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range[bisect(thresholds, x)];
  }

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    domain = [];
    for (var i = 0, n = x.length, v; i < n; ++i) if (v = x[i], v != null && !isNaN(v = +v)) domain.push(v);
    domain.sort(ascending);
    return rescale();
  };

  scale.range = function(x) {
    if (!arguments.length) return range.slice();
    range = x.slice();
    return rescale();
  };

  scale.quantiles = function() {
    return thresholds;
  };

  scale.invertExtent = function(y) {
    y = range.indexOf(y);
    return y < 0 ? [NaN, NaN] : [
      y > 0 ? thresholds[y - 1] : domain[0],
      y < thresholds.length ? thresholds[y] : domain[domain.length - 1]
    ];
  };

  scale.copy = function() {
    return newQuantile(domain, range); // copy on write!
  };

  return rescale();
}

export default function() {
  return newQuantile([], []);
};
