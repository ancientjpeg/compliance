import { expect, test } from 'vitest'
import stringReplace from './stringReplace'
import defaultReplacer from './defaultReplacer'

test('stringReplace replaces all words in default replacer', async () => {


  expect(defaultReplacer.get('advocates')).toBe('proponents')

  const capitalize = (s: string): string => {
    return s[0].toUpperCase() + s.slice(1)
  }

  const antiCapitalize = (s: string): string => {
    return s[0].toLowerCase() + s.slice(1).toUpperCase()
  }


  for (const key of defaultReplacer.keys()) {
    expect(key).toEqual(key.toLowerCase());
    expect(await stringReplace(key, defaultReplacer)).toBe(defaultReplacer.get(key))
    expect(await stringReplace(capitalize(key), defaultReplacer)).toBe(capitalize(defaultReplacer.get(key)!))
    expect(await stringReplace(antiCapitalize(key), defaultReplacer)).toBe(defaultReplacer.get(key))
    expect(await stringReplace(key.toUpperCase(), defaultReplacer)).toBe(defaultReplacer.get(key)!.toUpperCase())
  }

})

test('stringReplace prioritizes longest match', async () => {

  let replacer = new Map(
    [
      ["the", "not the"],
      ["sea", "lake"],
      ["the sea", "not the sea"]
    ]
  )

  expect(await stringReplace("The Sea", replacer)).toBe("Not the sea")
  expect(await stringReplace("The stuff", replacer)).toBe("Not the stuff")
  expect(await stringReplace("I love seas!", replacer)).toBe("I love lakes!")

})
