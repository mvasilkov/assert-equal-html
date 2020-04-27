'use strict'

const { describe, it } = require('smoltest')(exports)

const { assertEqual, assertNotEqual } = require('..')

describe('Sanity', () => {
    describe('Text', () => {
        it('Identity', async () => {
            await assertEqual('', '')
            await assertEqual('утречко', 'утречко')
        })

        it('Empty', async () => {
            await assertNotEqual('утречко', '')
            await assertNotEqual('', 'утречко')
        })

        it('Spaces', async () => {
            await assertEqual('  утречко  ', 'утречко')
            await assertEqual('утречко', '  утречко  ')
        })
    })

    describe('HTML', () => {
        it('Identity', async () => {
            await assertEqual('<p></p>', '<p></p>')
            await assertEqual('<p>волночки</p>', '<p>волночки</p>')
        })

        it('Empty', async () => {
            await assertNotEqual('<p>волночки</p>', '<p></p>')
            await assertNotEqual('<p></p>', '<p>волночки</p>')
        })

        it('Spaces', async () => {
            await assertEqual('  <p>  волночки  </p>  ', '<p>волночки</p>')
            await assertEqual('<p>волночки</p>', '  <p>  волночки  </p>  ')
        })
    })
})
