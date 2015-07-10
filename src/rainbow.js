import linear from "./linear";
import {interpolateCubehelixLong} from "d3-color";

export default function() {
  return linear()
      .interpolate(interpolateCubehelixLong)
      .domain([0, 0.5, 1.0])
      .range([color.cubehelix(-100, 0.75, 0.35), color.cubehelix(80, 1.50, 0.8), color.cubehelix(260, 0.75, 0.35)]);
};
