export default function sqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

sqrt.invert = function(x) {
  return x < 0 ? -x * x : x * x;
};
