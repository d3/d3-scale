import linear from "./linear";
import {cubehelix} from "d3-color";
import {cubehelixLong} from "d3-interpolate";

export default function() {
  return linear()
      .interpolate(cubehelixLong)
      .domain([0, 0.5, 1.0])
      .range([cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8), cubehelix(260, 0.75, 0.35)]);
};
