import assert from "assert";
import * as d3 from "../src/index.js";

const exclude = [
	'tickFormat',
	'scaleImplicit'
]

// test that every scale has the right `type` prop
Object.keys(d3).filter(d => {
	return !exclude.includes(d);
}).forEach(d => {
	it(`${d}() has the expected type`, () => {
		const type = d.replace('scale', '')
			.replace(/^\w/, w => w.toLowerCase())
		const scale = d3[d]();
		assert.strictEqual(scale.type, type);
	});
});
