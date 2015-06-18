import {
  range
} from "d3-arrays";

import extent from "./extent";

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

export function tickRange(domain, count) {
  if (count == null) count = 10;
  domain = extent(domain);

  var span = domain[1] - domain[0],
      step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
      error = span / count / step;

  // Filter ticks to get closer to the desired count.
  if (error >= e10) step *= 10;
  else if (error >= e5) step *= 5;
  else if (error >= e2) step *= 2;

  // Round start and stop values to step interval.
  domain[0] = Math.ceil(domain[0] / step) * step;
  domain[1] = Math.floor(domain[1] / step) * step + step / 2; // inclusive
  domain[2] = step;
  return domain;
};

export default function(domain, count) {
  return range.apply(null, tickRange(domain, count));
};
