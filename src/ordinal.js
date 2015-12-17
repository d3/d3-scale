import {map} from "d3-array";
import {slice} from "./array";

var rangeRecycle = {};

export default function ordinal() {
  var index = map(),
      domain = [],
      range = [],
      rangeMissing = rangeRecycle;

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (rangeMissing !== rangeRecycle) return rangeMissing;
      index.set(key, i = domain.push(d));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = map();
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_, missing) {
    return arguments.length ? (range = slice.call(_), rangeMissing = arguments.length < 2 ? rangeRecycle : missing, scale) : range.slice();
  };

  scale.copy = function() {
    return ordinal().domain(domain).range(range, rangeMissing);
  };

  return scale;
};
