import linear from "./linear";
import {cubehelix, interpolateCubehelixLong} from "d3-color";

export default function() {
  return linear()
      .interpolate(interpolateCubehelixLong)
      .range([cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0)]);
};
