import linear from "./linear";
import {interpolateCubehelixLong} from "d3-color";

export default function() {
  return linear()
      .interpolate(interpolateCubehelixLong)
      .range([color.cubehelix(300, 0.5, 0.0), color.cubehelix(-240, 0.5, 1.0)]);
};
