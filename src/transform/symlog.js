export default function symlog(x) {
  return x < -1 ? -Math.log(-x) - 1 : x > 1 ? Math.log(x) + 1 : x;
}

symlog.invert = function(x) {
  return x < -1 ? -Math.exp(-x - 1) : x > 1 ? Math.exp(x - 1) : x;
};
