export default function(domain, step) {
  domain = domain.slice();
  if (!step) return domain;

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = Math.floor(x0 / step) * step;
  domain[i1] = Math.ceil(x1 / step) * step;
  return domain;
};
