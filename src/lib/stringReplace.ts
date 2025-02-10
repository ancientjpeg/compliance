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
    while ((match = RegExp(`${key}`, 'i').exec(input)) !== null) {

      const matchIndex = match.index
      const matchEnd = matchIndex + match[0].length
      let firstCapital = match[0][0].toUpperCase() == match[0][0];
      let anyLower = /[a-z]/.test(match[0])


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

    }
  }

  return input
}

