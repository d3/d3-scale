import {default as compound} from "./compound";
import {default as linear} from "./linear";
import {default as log} from "./log";

function intersection(r1, r2) {
  var reverse = r1[0] > r1[1];
  if (reverse) r1 = r1.slice().reverse();

  var min = r1[0] < r2[0] ? r1 : r2;
  var max = min === r1 ? r2 : r1;
  if (min[1] < max[0]) return null;

  var section = [max[0], min[1] < max[1] ? min[1] : max[1]];
  if (section[0] === section[1]) return null;

  if (reverse) section = section.slice().reverse();
  return section;
}

function rescale(range, domain) {
  var logScale = log(),
      d,
      parts = [];

  // Negative log scale
  if (d = intersection(domain, [Number.NEGATIVE_INFINITY, -1])) {
    parts.push({
      domain: d,
      type: log,
      extent: logScale(Math.abs(d[1] - d[0]) + 1) - logScale(1)
    });
  }

  // Linear scale
  if (d = intersection(domain, [-1, 1])) {
    parts.push({
      domain: d,
      type: linear,
      extent: Math.abs(d[1] - d[0]) * (logScale(2) - logScale(1))
    });
  }

  // Positive log scale
  if (d = intersection(domain, [1, Number.POSITIVE_INFINITY])) {
    parts.push({
      domain: d,
      type: log,
      extent: logScale(Math.abs(d[1] - d[0]) + 1) - logScale(1)
    });
  }

  // Create the scales
  var scales = [];
  var rangeSize = range[1] - range[0];
  var rangeExtent = parts.reduce(function (acc, part) { return part.extent + acc; }, 0);
  var rangeStart = range[0];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.extent > 0) {
      var ratio = part.extent / rangeExtent;
      var next = (i === parts.length - 1) ? range[1] : rangeStart + ratio * rangeSize;
      scales.push(part.type().domain(part.domain).range([rangeStart, next]));
      rangeStart = next;
    }
  }

  return scales;
}

export default function symlog() {
  var scale = compound(linear()),
      compoundRange = scale.range,
      compoundDomain = scale.domain;

  scale.domain = function(_) {
    return arguments.length ? scale.scales(rescale(scale.range(), _)) : compoundDomain();
  };

  scale.range = function(_) {
    return arguments.length ? scale.scales(rescale(_, scale.domain())) : compoundRange();
  };

  return scale;
}
