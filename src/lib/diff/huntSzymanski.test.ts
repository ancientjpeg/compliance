import { expect, test } from "vitest";
import huntSzymanski from "./huntSzymanski";

test("Hunt-Szymanski algorithm returns expected results", () => {

  expect(huntSzymanski('friend', 'fried').lcsLength).toBe(5);
  expect(huntSzymanski('abc', 'bac').lcsLength).toBe(2);
  expect(huntSzymanski('abc', 'bca').lcsLength).toBe(2);
  expect(huntSzymanski('cac', 'ccc').lcsLength).toBe(2);
  expect(huntSzymanski('azzzzzzzzzzzzzzzazzzzzzzzzzzzzzza', 'bbbaababzz').lcsLength).toBe(4);
  expect(huntSzymanski('ciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', 'icu').lcsLength).toBe(1);
  expect(huntSzymanski('baaa', 'bbbaababzz').lcsLength).toBe(4);
  expect(huntSzymanski('cac', 'ccc').lcsLength).toBe(2);
  expect(huntSzymanski('cac', 'ccc').lcsLength).toBe(2);
  expect(huntSzymanski('I hunt', 'You hunt').lcsLength).toBe(5);
  expect(huntSzymanski('He killed my cat!', 'She knows my dog.').lcsLength).toBe(7);
});
