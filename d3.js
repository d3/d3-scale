import {
  ascending,
  bisect,
  bisectLeft,
  bisectRight,
  bisector,
  descending,
  deviation,
  entries,
  extent,
  keys,
  max,
  mean,
  median,
  merge,
  min,
  nest,
  pairs,
  permute,
  quantile,
  range,
  shuffle,
  sum,
  transpose,
  values,
  variance,
  zip
} from "d3-arrays";

import {
  interpolate,
  interpolateArray,
  interpolateNumber,
  interpolateObject,
  interpolateRound,
  interpolateString,
  interpolateTransform,
  interpolateZoom,
  interpolators
} from "d3-interpolate";

import {
  linear
} from "./index";

export default {
  ascending: ascending,
  bisect: bisect,
  bisectLeft: bisectLeft,
  bisector: bisector,
  bisectRight: bisectRight,
  descending: descending,
  deviation: deviation,
  entries: entries,
  extent: extent,
  interpolate: interpolate,
  interpolateArray: interpolateArray,
  interpolateNumber: interpolateNumber,
  interpolateObject: interpolateObject,
  interpolateRound: interpolateRound,
  interpolateString: interpolateString,
  interpolateTransform: interpolateTransform,
  interpolateZoom: interpolateZoom,
  interpolators: interpolators,
  keys: keys,
  max: max,
  mean: mean,
  median: median,
  merge: merge,
  min: min,
  nest: nest,
  pairs: pairs,
  permute: permute,
  quantile: quantile,
  range: range,
  scale: {
    linear: linear
  },
  shuffle: shuffle,
  sum: sum,
  transpose: transpose,
  values: values,
  variance: variance,
  zip: zip
};
