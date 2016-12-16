import linear, {linearish} from "./linear.js";
import number from "./number.js";

function square(x) {
  return (x < 0 ? -1 : 1) * x * x;
}

function unsquare(x) {
  return (x < 0 ? -1 : 1) * Math.sqrt(Math.abs(x));
}

export default function radial() {
  var squared = linear(),
      range = [0, 1],
      round = false;

  function scale(x) {
    var y = unsquare(squared(x));
    return round ? Math.round(y) : y;
  }

  scale.invert = function(y) {
    return squared.invert(square(y));
  };

  scale.domain = function(_) {
    return arguments.length ? (squared.domain(_), scale) : squared.domain();
  };

  scale.range = function(_) {
    return arguments.length ? (squared.range((range = Array.from(_, number)).map(square)), scale) : range.slice();
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, scale) : round;
  };

  scale.clamp = function(_) {
    return arguments.length ? (squared.clamp(_), scale) : squared.clamp();
  };

  scale.copy = function() {
    return radial()
        .domain(squared.domain())
        .range(range)
        .round(round)
        .clamp(squared.clamp());
  };

  return linearish(scale);
}
