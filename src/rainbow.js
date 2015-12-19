import constant from "./constant";
import linear from "./linear";
import {cubehelix} from "d3-color";
import {cubehelixLong} from "d3-interpolate";

var a = cubehelix(-100, 0.75, 0.35),
    b = cubehelix(80, 1.50, 0.8),
    c = cubehelix(260, 0.75, 0.35),
    d = cubehelix();

var cubehelixRainbow = constant(function(t) {
  var ts = Math.abs(t - 0.5);
  d.h = 360 * t - 100;
  d.s = 1.5 - 1.5 * ts;
  d.l = 0.8 - 0.9 * ts;
  return d + "";
});

export function warm() {
  return linear()
      .interpolate(cubehelixLong)
      .range([a, b]);
};

export function cool() {
  return linear()
      .interpolate(cubehelixLong)
      .range([c, b]);
};

export default function() {
  return linear()
      .interpolate(cubehelixRainbow)
      .range([a, c]);
};
