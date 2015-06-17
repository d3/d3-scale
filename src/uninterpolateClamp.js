export default function(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return Math.max(0, Math.min(1, (x - a) / b));
  };
};
