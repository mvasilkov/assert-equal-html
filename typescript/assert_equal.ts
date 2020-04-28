'use strict'

import { strict as assert } from 'assert'
import { Readable, finished } from 'stream'

import SAXParser from 'parse5-sax-parser'

import { escapeAttr, escapeText } from './util'

export async function assertEqual(actual: string, expected: string, error?: string) {
    actual = await normalize(actual)
    expected = await normalize(expected)
    assert.strictEqual(actual, expected, error)
}

export async function assertNotEqual(actual: string, expected: string, error?: string) {
    actual = await normalize(actual)
    expected = await normalize(expected)
    assert.notStrictEqual(actual, expected, error)
}

export function normalize(a: string): Promise<string> {
    return new Promise(resolve => {
        const str = new Readable({ encoding: 'utf8', highWaterMark: 0 })
        str.push(a)
        str.push(null)

        const parser = new SAXParser
        const result: string[] = []
        const buf: string[] = []

        function saveBuf() {
            if (!buf.length) return
            const a = stripCollapse(buf.join(''))
            if (a) result.push(escapeText(a))
            buf.length = 0
        }

        parser.on('startTag', ({ tagName, attrs, selfClosing }) => {
            saveBuf()
            /* In ES2019, Array.prototype.sort is stable.
             * https://www.ecma-international.org/ecma-262/10.0/index.html#sec-array.prototype.sort
             * https://v8.dev/blog/array-sort
             */
            const a = Array.from(attrs).sort(({ name: a }, { name: b }) => {
                /* The arguments are lowercase */
                if (a < b) return -1
                if (a > b) return 1
                return 0
            }).map(({ name, value }) => {
                if (name === 'class')
                    value = stripCollapse(value).split(' ').sort().join(' ')
                return `${name}="${escapeAttr(value)}"`
            }).join(' ')
            result.push(`<${tagName}${a ? ' ' : ''}${a}${selfClosing ? ' /' : ''}>`)
        })

        parser.on('endTag', ({ tagName }) => {
            saveBuf()
            result.push(`</${tagName}>`)
        })

        parser.on('text', ({ text }) => {
            buf.push(text)
        })

        finished(parser, () => {
            saveBuf()
            resolve(prettyPrint(result))
        })

        str.pipe(parser)
    })
}

export function stripCollapse(a: string): string {
    a = a.replace(/[\u0009\u000A\u000C\u000D\u0020]{1,}/g, ' ')
    const start = +a.startsWith(' ')
    const end = +a.endsWith(' ')
    return a.slice(start, a.length - end)
}

export function prettyPrint(lines: string[]) {
    const indentation: number[] = []
    let n = 0

    lines.forEach(str => {
        if (str.startsWith('</')) indentation.push(--n)
        else if (str.startsWith('<')) indentation.push(n++)
        else indentation.push(n)
    })

    return lines.map((str, pos) => '  '.repeat(indentation[pos]) + str)
        .join('\n')
}
