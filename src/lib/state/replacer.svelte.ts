import defaultReplacer from "./defaultReplacer";
import { SvelteMap } from "svelte/reactivity";
import type { Replacer } from "./replacer.d";
import replacerVerify from "./replacerVerify";

export let replacer = $state(structuredClone(defaultReplacer));

export function createReplacerFromText(replacerText: string): Replacer {
  let obj;

  try {
    obj = JSON.parse(replacerText);
  } catch (e) {
    throw new SyntaxError(`Failed to parse replacer JSON: ${replacerText}`);
  }

  const repl: Replacer = new Map<string, string>(obj);

  const verification = replacerVerify(repl);
  if (verification !== null) {
    throw new SyntaxError(
      `Invalid replacer; found keys in values: ${verification}`,
    );
  }

  return repl;
}

export function attemptReplacerUpdate(replacerText: string): void {
  replacer = createReplacerFromText(replacerText);
}

export function resetReplacer(): void {
  replacer = new SvelteMap(defaultReplacer);
  console.error("SVELTEMAP CLONE!");
}
