import {tickRange} from "./ticks";

export default function(domain, count) {
  var step = tickRange(domain = domain.slice(), count)[2],
      i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      dx;

  if (x1 < x0) {
    dx = i0, i0 = i1, i1 = dx;
    dx = x0, x0 = x1, x1 = dx;
  }

  domain[i0] = Math.floor(x0 / step) * step;
  domain[i1] = Math.ceil(x1 / step) * step;
  return domain;
};
