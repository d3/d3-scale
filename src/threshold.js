import {bisect} from "d3-arrays";

function newThreshold(domain, range, n) {

  function scale(x) {
    if (x <= x) return range[bisect(domain, x, 0, n)];
  }

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.slice(), n = Math.min(domain.length, range.length - 1);
    return scale;
  };

  scale.range = function(x) {
    if (!arguments.length) return range.slice();
    range = x.slice(), n = Math.min(domain.length, range.length - 1);
    return scale;
  };

  scale.invertExtent = function(y) {
    return y = range.indexOf(y), [domain[y - 1], domain[y]];
  };

  scale.copy = function() {
    return newThreshold(domain, range);
  };

  return scale;
};

export default function() {
  return newThreshold([.5], [0, 1], 1);
};
