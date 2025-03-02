import type { Replacer } from "./replacer";

export default (replacer: Replacer): Map<string, [string, string]> | null => {

  let ret = new Map<string, [string, string]>;

  for (const key of replacer.keys()) {
    for (const e of replacer.entries()) {

      const v = e[1];

      if (v.includes(key)) {
        ret.set(key, e);
      }

    }
  }

  return ret.size == 0 ? null : ret;
}
