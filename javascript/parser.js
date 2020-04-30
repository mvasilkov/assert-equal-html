'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse5_sax_parser_1 = __importDefault(require("parse5-sax-parser"));
const util_1 = require("./util");
const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr',
    'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
function initParser() {
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
        const end = selfClosing || voidElements.has(tagName) ? ' /' : '';
        result.push(`<${tagName}${a ? ' ' : ''}${a}${end}>`);
    });
    parser.on('endTag', ({ tagName }) => {
        saveBuf();
        result.push(`</${tagName}>`);
    });
    parser.on('text', ({ text }) => {
        buf.push(text);
    });
    function getResult() {
        saveBuf();
        return prettyPrint(result);
    }
    return {
        parser,
        getResult,
    };
}
exports.initParser = initParser;
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
        if (str.startsWith('</') && n != 0)
            indentation.push(--n);
        else if (str.startsWith('<') && !str.endsWith('/>'))
            indentation.push(n++);
        else
            indentation.push(n);
    });
    return lines.map((str, pos) => '  '.repeat(indentation[pos]) + str)
        .join('\n');
}
exports.prettyPrint = prettyPrint;
