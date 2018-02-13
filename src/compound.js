export default function compound() {
  var scales = [].slice.call(arguments);
  if (scales.length === 0) {
    return null;
  }

  function scale(x) {
    for (var i = 0; i < scales.length; i++) {
      var domain = scales[i].domain();
      if (Math.min.apply(null, domain) <= x && x <= Math.max.apply(null, domain)) {
        return scales[i](x);
      }
    }
    // Fallback to last scale
    return scales[scales.length - 1](x);
  }

  scale.domain = function() {
    if (arguments.length) {
      throw 'Setting a domain is not supported on compound scales';
    }
    var values = [].concat.apply([], scales.map(function(s) { return s.domain(); }));
    var domain = [Math.min.apply(null, values), Math.max.apply(null, values)];
    if (values[0] > values[1]) domain = domain.slice().reverse();
    return domain;
  };

  scale.range = function() {
    if (arguments.length) {
      throw 'Setting a range is not supported on compound scales';
    }
    var values = [].concat.apply([], scales.map(function(s) { return s.range(); }));
    var range = [Math.min.apply(null, values), Math.max.apply(null, values)];
    if (values[0] > values[1]) range = range.slice().reverse();
    return range;
  };

  scale.copy = function() {
    return compound.apply(null, scales.map(function(s) { return s.copy(); }));
  };

  scale.scales = function(_) {
    return arguments.length ? (scales = _, scale) : scales;
  };

  return scale;
}
