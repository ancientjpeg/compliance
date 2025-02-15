type StringDict = { [term: string]: string }
type StringArray = string[]
export type Terms = StringDict | StringArray

function isArray(terms: Terms): terms is StringArray {
  return Array.isArray(terms)
}


export const defaultReplacer = {
  shit: 'drattles',
  damn: 'drikes'
};

export const stringReplace = (input: string, terms: Terms): string => {

  const termsAreArray = isArray(terms)

  for (const key in terms) {

    let match;
    const re = RegExp(key.toLowerCase(), 'gi')
    while ((match = re.exec(input)) !== null) {


      console.log("LAST IDX: " + re.lastIndex)
      const matchIndex = match.index
      const matchEnd = re.lastIndex === 0 ? matchIndex + match[0].length : re.lastIndex
      const firstCapital = match[0][0].toUpperCase() == match[0][0];
      const anyLower = /[a-z]/.test(match[0])
      const matchValue = match[0]

      /* additional letters make this technically not a "match */
      if (matchEnd != input.length && /[A-Za-z]/.test(input[matchEnd])) {
        console.log("CONTINUE")
        console.log({ key, matchIndex, matchEnd, matchValue })
        continue;
      }

      let replacement: string;

      if (!termsAreArray) {
        if (firstCapital && anyLower) {
          replacement = terms[key].toLowerCase()
          replacement = replacement[0].toUpperCase() + replacement.slice(1)
        } else if (anyLower) {
          replacement = terms[key].toLowerCase()
        } else {
          replacement = terms[key].toUpperCase()
        }
      } else {
        replacement = "[REDACTED]"
      }

      input = input.slice(0, matchIndex) + replacement + input.slice(matchEnd)
      console.log({ key, matchIndex, matchEnd, matchValue, replacement })

    }
  }

  return input
}

