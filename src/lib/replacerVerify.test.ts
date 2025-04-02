import { test, expect } from 'vitest';
import replacerVerify from '$lib/replacerVerify';
import defaultReplacer from './defaultReplacer';

test('Replacer verification works as expected', () => {
	const badInput = new Map<string, string>([
		['foo', 'bar'],
		['bad', 'foo']
	]);

	const badOutput = new Map<string, [string, string]>([['foo', ['bad', 'foo']]]);

	const goodInput = new Map<string, string>([
		['foo', 'bar'],
		['boo', 'far']
	]);

	expect(replacerVerify(badInput)).toStrictEqual(badOutput);
	expect(replacerVerify(goodInput)).toBeNull();
});

test('Default replacer passes verification', () => {
	const output = replacerVerify(defaultReplacer);
	expect(output).toBeNull();
});
