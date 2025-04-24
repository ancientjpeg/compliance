import defaultReplacer from "./defaultReplacer";
import type { Replacer } from "./replacer.d";
import replacerVerify from "./replacerVerify";

export const replacer = $state(new Map(defaultReplacer));

export class ReplacerSyntaxError extends SyntaxError {
  key: string;
  valueKey: string;
  value: string;
  constructor(message: string, offendingItem: [string, [string, string]]) {
    super(message);
    this.name = "ReplacerSyntaxError";
    this.key = offendingItem[0];
    this.valueKey = offendingItem[1][0];
    this.value = offendingItem[1][1];
  }
}

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
    throw new SyntaxError(
      `Failed to parse replacer JSON (parser returned empty): ${replacerText}`,
    );
  }

  const repl: Replacer = new Map<string, string>(Object.entries(obj));

  const verification = replacerVerify(repl);
  if (verification !== null) {
    const entries = [...verification.entries()];
    throw new ReplacerSyntaxError(
      `Invalid replacer; found keys in values: ${verification}`,
      entries[0],
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
