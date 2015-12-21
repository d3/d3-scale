import band from "./band";

function point(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return point(copy());
  };

  return scale;
}

export default function() {
  return point(band().paddingInner(1));
};
