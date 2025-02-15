type StringDict = { [term: string]: string }
type StringArray = string[]
export type Terms = StringDict | StringArray

function isArray(terms: Terms): terms is StringArray {
  return Array.isArray(terms)
}



export const stringReplace = (input: string, terms: Terms): string => {

  let maxKeyLength = 0

  const termsAreArray = isArray(terms)
  const termKeys = termsAreArray ? terms : Object.keys(terms);

  /* TODO: optimize this by only determining max length when terms change */
  for (const key in termKeys) {
    maxKeyLength = Math.max(key.length, maxKeyLength)
  }


  return input
}

