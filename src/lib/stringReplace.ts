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


  const memo = Array.from({ length: input.length }, l => Array(l).fill(null))

  const outerEnd = input.length - maxKeyLength + 1;

  for (let i = 0; i < outerEnd; ++i) {

    const innerEnd = i + maxKeyLength;
    for (let j = i; j < innerEnd; j++) {
      if (memo[i][j] !== null) {
        continue;
      }

      memo[i][j] = true;



    }


  }




  return input
}

