import { expect, test } from 'vitest'
import { stringReplace, defaultReplacer } from './stringReplace'

test('stringReplace works as expected', () => {


  expect(defaultReplacer.damn).toBe('drikes')

  let testReplacer: { [term: string]: string } = {
    "damn": "drikes",
    "Damn": "Drikes",
    "dAMn": "drikes",
    "DAMN": "DRIKES",
    "damn and": "drikes and",
    "damn and Shit": "drikes and Drattles",
  };

  for (const key in testReplacer) {
    expect(stringReplace(key, defaultReplacer)).toBe(testReplacer[key])
  }

}) 
