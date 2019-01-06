export default function pow(exponent) {
  exponent = +exponent;
  function pow(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }
  pow.invert = function(x) {
    return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
  };
  return pow;
}
