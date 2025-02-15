import { expect, test } from 'vitest'
import { stringReplace } from './stringReplace'
import defaultReplacer from './defaultReplacer'

test('stringReplace works as expected', () => {


  expect(defaultReplacer.get('advocates')).toBe('champions')

  const capitalize = (s: string): string => {
    return s[0].toUpperCase() + s.slice(1)
  }

  const antiCapitalize = (s: string): string => {
    return s[0].toLowerCase() + s.slice(1).toUpperCase()
  }


  for (const key of defaultReplacer.keys()) {
    console.log({ key })
    expect(key == key.toLowerCase()).toBeTruthy();
    expect(stringReplace(key, defaultReplacer)).toBe(defaultReplacer.get(key))
    expect(stringReplace(capitalize(key), defaultReplacer)).toBe(capitalize(defaultReplacer.get(key)!))
    expect(stringReplace(antiCapitalize(key), defaultReplacer)).toBe(defaultReplacer.get(key))
    expect(stringReplace(key.toUpperCase(), defaultReplacer)).toBe(defaultReplacer.get(key)!.toUpperCase())
  }

}) 
