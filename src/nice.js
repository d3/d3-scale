export default function(domain, interval) {
  domain = domain.slice();

  let i0 = 0;
  let i1 = domain.length - 1;
  let x0 = domain[i0];
  let x1 = domain[i1];
  let t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}
