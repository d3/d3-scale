export default function log(x) {
  return Math.log(x);
}

log.invert = function(x) {
  return Math.exp(x);
};
