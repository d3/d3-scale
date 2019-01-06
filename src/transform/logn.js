export default function logn(x) {
  return -Math.log(-x);
}

logn.invert = function(x) {
  return -Math.exp(-x);
};
