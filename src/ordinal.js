import {map} from "d3-collection";
import {slice} from "./array";

export var implicit = {name: "implicit"};

export default function ordinal(range) {
  var index = map(),
      inverseIndex = null,
      domain = [],
      unknown = implicit;

  range = range == null ? [] : slice.call(range);

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
      inverseIndex = null;
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = map(), inverseIndex = null;
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice.call(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.invert = function(_) {
    if (!inverseIndex) {
      inverseIndex = map();
      var n = domain.length;
      while (--n >= 0) inverseIndex.set(range[n], n+1);
    }
    return domain[inverseIndex.get(_) - 1];
  };

  scale.copy = function() {
    return ordinal()
        .domain(domain)
        .range(range)
        .unknown(unknown);
  };

  return scale;
}