'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const stream_1 = require("stream");
const parse5_sax_parser_1 = __importDefault(require("parse5-sax-parser"));
const util_1 = require("./util");
function assertEqual(actual, expected, error) {
    return __awaiter(this, void 0, void 0, function* () {
        actual = yield normalizeA(actual);
        expected = yield normalizeA(expected);
        assert_1.strict.strictEqual(actual, expected, error);
    });
}
exports.assertEqual = assertEqual;
function assertNotEqual(actual, expected, error) {
    return __awaiter(this, void 0, void 0, function* () {
        actual = yield normalizeA(actual);
        expected = yield normalizeA(expected);
        assert_1.strict.notStrictEqual(actual, expected, error);
    });
}
exports.assertNotEqual = assertNotEqual;
function normalizeA(a) {
    return new Promise(resolve => {
        const str = new stream_1.Readable({ encoding: 'utf8', highWaterMark: 0 });
        str.push(a);
        str.push(null);
        const parser = new parse5_sax_parser_1.default;
        const result = [];
        const buf = [];
        function saveBuf() {
            if (!buf.length)
                return;
            const a = stripCollapse(buf.join(''));
            if (a)
                result.push(util_1.escapeText(a));
            buf.length = 0;
        }
        parser.on('startTag', ({ tagName, attrs, selfClosing }) => {
            saveBuf();
            /* In ES2019, Array.prototype.sort is stable.
             * https://www.ecma-international.org/ecma-262/10.0/index.html#sec-array.prototype.sort
             * https://v8.dev/blog/array-sort
             */
            const a = Array.from(attrs).sort(({ name: a }, { name: b }) => {
                /* The arguments are lowercase */
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
            }).map(({ name, value }) => {
                if (name === 'class')
                    value = stripCollapse(value).split(' ').sort().join(' ');
                return `${name}="${util_1.escapeAttr(value)}"`;
            }).join(' ');
            result.push(`<${tagName}${a ? ' ' : ''}${a}${selfClosing ? ' /' : ''}>`);
        });
        parser.on('endTag', ({ tagName }) => {
            saveBuf();
            result.push(`</${tagName}>`);
        });
        parser.on('text', ({ text }) => {
            buf.push(text);
        });
        stream_1.finished(parser, () => {
            saveBuf();
            resolve(prettyPrint(result));
        });
        str.pipe(parser);
    });
}
exports.normalizeA = normalizeA;
function stripCollapse(a) {
    a = a.replace(/[\u0009\u000A\u000C\u000D\u0020]{1,}/g, ' ');
    const start = +a.startsWith(' ');
    const end = +a.endsWith(' ');
    return a.slice(start, a.length - end);
}
exports.stripCollapse = stripCollapse;
function prettyPrint(lines) {
    const indentation = [];
    let n = 0;
    lines.forEach(str => {
        if (str.startsWith('</'))
            indentation.push(--n);
        else if (str.startsWith('<'))
            indentation.push(n++);
        else
            indentation.push(n);
    });
    return lines.map((str, pos) => '  '.repeat(indentation[pos]) + str)
        .join('\n');
}
exports.prettyPrint = prettyPrint;
