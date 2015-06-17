export default function(a, b) {
  b = (b -= a = +a) || 1 / b;
  return function(x) {
    return (x - a) / b;
  };
};
