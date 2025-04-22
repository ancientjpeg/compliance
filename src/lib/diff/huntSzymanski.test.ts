import { expect, test } from "vitest";
import huntSzymanski from "./huntSzymanski";

test("Hunt-Szymanski algorithm returns expected results", () => {
  expect(huntSzymanski("friend", "fried")).toBe(5);
  expect(huntSzymanski("abc", "bac")).toBe(2);
  expect(huntSzymanski("abc", "bca")).toBe(2);
  expect(huntSzymanski("cac", "ccc")).toBe(2);
  expect(huntSzymanski("azzzzzzzzzzzzzzzazzzzzzzzzzzzzzza", "bbbaababzz")).toBe(
    4,
  );
  expect(
    huntSzymanski("ciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", "icu"),
  ).toBe(1);
  expect(huntSzymanski("baaa", "bbbaababzz")).toBe(4);
  expect(huntSzymanski("cac", "ccc")).toBe(2);
  expect(huntSzymanski("cac", "ccc")).toBe(2);
  expect(huntSzymanski("I hunt", "You hunt")).toBe(5);
  expect(huntSzymanski("He killed my cat!", "She knows my dog.")).toBe(7);
});
