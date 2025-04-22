import { describe, bench } from "vitest";
import { myersDiffRaw } from "./myers";
import * as crypto from "node:crypto";

const randomString = (n: number) =>
  btoa(
    crypto
      .getRandomValues(new Uint8Array(n))
      .reduce((a, b) => a + String.fromCharCode(b), ""),
  );

const opts = { time: 500, iterations: 1 };

function getSimilarBenchForLength(len: number) {
  return () => {
    const bigString = "fluff ".repeat(len);

    const replace = "substance. \n";
    const begin = bigString.length / 4;
    const end = begin + replace.length;
    const bigChange =
      bigString.slice(0, begin) + replace + bigString.slice(end) + replace;

    myersDiffRaw(bigString, bigChange);
  };
}

const len = 1e3;
describe(`Myers ${Math.floor(len / 1000)}kchar`, () => {
  bench(
    "heterogenous",
    () => {
      const bigString0 = "a".repeat(len);
      const bigString1 = "z".repeat(len);

      myersDiffRaw(bigString0, bigString1);
    },
    opts,
  );

  bench(
    "random",
    () => {
      const bigString0 = randomString(len);
      const bigString1 = randomString(len);

      myersDiffRaw(bigString0, bigString1);
    },
    opts,
  );

  bench("similar", getSimilarBenchForLength(len), opts);
});

const longLen = 1e6;
bench(
  `Myers ${Math.floor(longLen / 1e6)}Mchar similar`,
  getSimilarBenchForLength(longLen),
  opts,
);
