import defaultReplacer from "./defaultReplacer";
import { SvelteMap } from "svelte/reactivity";
import type { Replacer } from "./replacer.d";
import replacerVerify from "./replacerVerify";

export const replacer = $state(new Map(defaultReplacer));

function replacerUpdate(newReplacer: Replacer) {
  replacer.clear();
  for (const [k, v] of newReplacer) {
    replacer.set(k, v);
  }
}

export function createReplacerFromText(replacerText: string): Replacer {
  let obj;
  try {
    obj = JSON.parse(replacerText);
  } catch (e) {
    throw new SyntaxError(`Failed to parse replacer JSON: ${replacerText}`);
  }

  if (Object.keys(obj).length === 0) {
    throw new SyntaxError(`Failed to parse replacer JSON: ${replacerText}`);
  }

  const repl: Replacer = new Map<string, string>(Object.entries(obj));

  const verification = replacerVerify(repl);
  if (verification !== null) {
    throw new SyntaxError(
      `Invalid replacer; found keys in values: ${verification}`,
    );
  }

  return repl;
}

export function attemptReplacerUpdate(replacerText: string): void {
  const newReplacer = createReplacerFromText(replacerText);
  replacerUpdate(newReplacer);
}

export function resetReplacer(): void {
  replacerUpdate(defaultReplacer);
}
