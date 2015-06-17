export default function(domain) {
  var start = domain[0],
      stop = domain[domain.length - 1];
  return start < stop
      ? [start, stop]
      : [stop, start];
};
