'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const stream_1 = require("stream");
const parser_1 = require("./parser");
function assertEqual(actual, expected, error) {
    actual = normalize(actual);
    expected = normalize(expected);
    assert_1.strict.strictEqual(actual, expected, error);
}
exports.assertEqual = assertEqual;
function assertNotEqual(actual, expected, error) {
    actual = normalize(actual);
    expected = normalize(expected);
    assert_1.strict.notStrictEqual(actual, expected, error);
}
exports.assertNotEqual = assertNotEqual;
function normalize(a) {
    const nop = () => undefined;
    const { parser, getResult } = parser_1.initParser();
    parser._transform(a, 'utf8', nop);
    parser._final(nop);
    return getResult();
}
exports.normalize = normalize;
function normalizeA(a) {
    return new Promise(resolve => {
        const str = new stream_1.Readable({ encoding: 'utf8', highWaterMark: 0 });
        str.push(a);
        str.push(null);
        const { parser, getResult } = parser_1.initParser();
        stream_1.finished(parser, () => resolve(getResult()));
        str.pipe(parser);
    });
}
exports.normalizeA = normalizeA;
