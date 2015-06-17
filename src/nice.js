function stepFloor(step) {
  return function(x) {
    return Math.floor(x / step) * step;
  };
}

function stepCeil(step) {
  return function(x) {
    return Math.ceil(x / step) * step;
  };
}

export default function(domain, floor, ceil) {
  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      dx;

  if (x1 < x0) {
    dx = i0, i0 = i1, i1 = dx;
    dx = x0, x0 = x1, x1 = dx;
  }

  domain[i0] = floor(x0);
  domain[i1] = ceil(x1);
  return domain;
};
