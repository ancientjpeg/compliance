import { bench } from 'vitest';
import myersDiff from './myers';
import * as crypto from 'node:crypto';

const randomString = (n: number) =>
	btoa(crypto.getRandomValues(new Uint8Array(n)).reduce((a, b) => a + String.fromCharCode(b), ''));

const len = 1e3;
const opts = { time: 500, iterations: 1 };

bench(
	'Myers 1kchar heterogenous',
	() => {
		const bigString0 = 'a'.repeat(len);
		const bigString1 = 'z'.repeat(len);

		myersDiff(bigString0, bigString1);
	},
	opts
);

bench(
	'Myers 1kchar random',
	() => {
		const bigString0 = randomString(len);
		const bigString1 = randomString(len);

		myersDiff(bigString0, bigString1);
	},
	opts
);

bench(
	'Myers 1kchar similar',
	() => {
		const bigString = 'fluff '.repeat(len);

		const replace = 'substance. \n';
		const begin = bigString.length / 4;
		const end = begin + replace.length;
		const bigChange = bigString.slice(0, begin) + replace + bigString.slice(end) + replace;

		myersDiff(bigString, bigChange);
	},
	opts
);
