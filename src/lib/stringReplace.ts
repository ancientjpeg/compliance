type StringDict = { [term: string]: string }
type StringArray = [string]
export type Terms = StringDict | StringArray

function isArray(terms: Terms): terms is StringArray {
  return Array.isArray(terms)
}


export const stringReplace = (input: string, terms: Terms): string => {

  const termsAreArray = isArray(terms)

  for (const key in terms) {
    const replacement = termsAreArray ? "[REDACTED]" : terms[key];

    input = input.replaceAll(key, replacement)

  }

  return input
}

