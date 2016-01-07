import {cubehelix} from "d3-color";
import {interpolateCubehelixLong} from "d3-interpolate";
import sequential from "./sequential";

var a = cubehelix(-100, 0.75, 0.35),
    b = cubehelix(80, 1.50, 0.8),
    c = cubehelix(260, 0.75, 0.35),
    d = cubehelix();

var interpolateWarm = interpolateCubehelixLong(a, b),
    interpolateCool = interpolateCubehelixLong(c, b);

function interpolateRainbow(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  d.h = 360 * t - 100;
  d.s = 1.5 - 1.5 * ts;
  d.l = 0.8 - 0.9 * ts;
  return d + "";
}

export function warm() {
  return sequential(interpolateWarm);
};

export function cool() {
  return sequential(interpolateCool);
};

export default function() {
  return sequential(interpolateRainbow);
};
