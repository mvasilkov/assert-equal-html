'use strict'

import { strict as assert } from 'assert'
import { Readable, finished } from 'stream'

import { initParser } from './parser'

export function assertEqual(actual: string, expected: string, error?: string | Error) {
    actual = normalize(actual)
    expected = normalize(expected)
    assert.strictEqual(actual, expected, error)
}

export function assertNotEqual(actual: string, expected: string, error?: string | Error) {
    actual = normalize(actual)
    expected = normalize(expected)
    assert.notStrictEqual(actual, expected, error)
}

export function normalize(a: string): string {
    const nop = () => undefined
    const { parser, getResult } = initParser()

    parser._transform(a, 'utf8', nop)
    parser._final(nop)

    return getResult()
}

export function normalizeA(a: string): Promise<string> {
    return new Promise(resolve => {
        const str = new Readable({ encoding: 'utf8', highWaterMark: 0 })
        str.push(a)
        str.push(null)

        const { parser, getResult } = initParser()

        finished(parser, () => resolve(getResult()))

        str.pipe(parser)
    })
}
