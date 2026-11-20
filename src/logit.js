import { copy, transformer } from "./continuous.js";
import { initRange } from "./init.js";
import tickFormat from "./tickFormat.js";
import nice from "./nice.js";

export const logitScaleDefDomain = [0.001, 0.999];

export const mirrorNumber = (n) => {
  const mirrored = 1 - n;
  const s1 = n.toString().split(".")[1];
  const s2 = mirrored.toString().split(".")[1];
  if (s1 && s2) {
    if (s1.length == s2.length) return mirrored;
    return parseFloat(mirrored.toPrecision(s1.length));
  }
  return mirrored;
};

export const getTick = (i, k = 1) => {
  if (k >= 5 && (i == 1 || i == -1)) return null;
  if (i < 0) return parseFloat(k + "e" + i);
  else return mirrorNumber(parseFloat(k + "e" + -i));
};

export const guessDecade = (number) => {
  if (number < 0.5) {
    return Math.floor(Math.log10(number));
  } else {
    const approximated = Math.floor(Math.log10(1 - number));
    if (number <= mirrorNumber("1e" + (approximated + 1)))
      return -(approximated + 1);
    return -approximated;
  }
};

function transformLogit(x) {
  return Math.log(x / (1 - x));
}

function transformLogistic(x) {
  return 1 / (1 + Math.pow(Math.E, -x));
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function logitish(transform) {
  const scale = transform(transformLogit, transformLogistic);
  const domain = scale.domain;

  scale.ticks = (count = 10) => {
    const d = domain(),
      a = d[0],
      b = d[d.length - 1];

    if (a <= 0 || a >= 1 || b >= 1 || b <= 0)
      return [pow10(-1), 0.5, 1 - pow10(-1)];

    let lowExp = guessDecade(a);
    let highExp = guessDecade(b);

    const detailLevel = count / Math.abs(lowExp - highExp);
    const intermediateTicks = [1, 5, 2, 3, 7];

    const vals = [];

    if (a < 0.5 && b > 0.5) vals.push(0.5);

    for (let i = lowExp; i < highExp + 1; i++) {
      if (i == 0) continue;
      if (detailLevel > 0.5) {
        for (let j = 0; j < detailLevel && j < intermediateTicks.length; j++) {
          if (i == lowExp && lowExp > 0 && j != 0) continue;
          const tick = getTick(i, intermediateTicks[j]);
          if (!tick || tick < a) continue;
          if (tick > b) continue;
          vals.push(tick);
        }
      } else if (
        i == lowExp ||
        i == highExp ||
        (detailLevel > 0.25 && i % 2 == 0) ||
        (detailLevel > 0.1 && i % 4 == 0) ||
        i % 8 == 0
      ) {
        vals.push(getTick(i, 1));
      }
    }

    return vals.sort((a, b) => a - b);
  };

  scale.tickFormat = function (count, specifier) {
    var d = domain();
    if (specifier)
      return tickFormat(
        d[0],
        d[d.length - 1],
        count == null ? 10 : count,
        specifier
      );
    return (n) => {
      if (n >= 0.01 && n <= 0.99) return n.toFixed(2);
      else if (n > 0.5) return "1-" + (1 - n).toExponential(0);
      return n.toExponential(0);
    };
  };

  scale.nice = () => {
    return domain(
      nice(domain(), {
        floor: (x) => pow10(Math.floor(Math.log10(x))),
        ceil: (x) => 1 - pow10(Math.floor(Math.log10(1 - x))),
      })
    );
  };

  return scale;
}

export default function logit() {
  const scale = logitish(transformer()).domain(logitScaleDefDomain);

  scale.copy = function () {
    return copy(scale, logit());
  };

  initRange.apply(scale, arguments);
  return scale;
}
