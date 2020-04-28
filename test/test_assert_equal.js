'use strict'

const { describe, it } = require('smoltest')(exports)

const { assertEqual, assertNotEqual } = require('..')

it('Usage', async () => {
    await assertEqual(
        '<button type="button" class="btn btn-link">Link</button>',
        '<button class="btn-link btn" type="button">Link</button>')
})

describe('Sanity', () => {
    describe('Text', () => {
        it('Identity', async () => {
            await assertEqual('', '')
            await assertEqual('утречко', 'утречко')
            await assertNotEqual('утречко', 'волночки')
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
            await assertNotEqual('<p>волночки</p>', '<p>утречко</p>')
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

    describe('Attributes', () => {
        it('Identity', async () => {
            await assertEqual('<p autocapitalize></p>', '<p autocapitalize></p>')
            await assertEqual('<p lang="ru"></p>', '<p lang="ru"></p>')
            await assertNotEqual('<p lang="ru"></p>', '<p lang="zh"></p>')
        })

        it('Empty', async () => {
            await assertNotEqual('<p lang="ru"></p>', '<p lang=""></p>')
            await assertNotEqual('<p lang=""></p>', '<p lang="ru"></p>')
        })

        it('Ordering', async () => {
            await assertEqual('<p lang="ru" autocapitalize></p>',
                '<p autocapitalize lang="ru"></p>')
        })
    })

    describe('Classes', () => {
        it('Identity', async () => {
            await assertEqual('<p class></p>', '<p class></p>')
            await assertEqual('<p class="working"></p>', '<p class="working"></p>')
        })

        it('Empty', async () => {
            await assertNotEqual('<p class="working"></p>', '<p class=""></p>')
            await assertNotEqual('<p class=""></p>', '<p class="working"></p>')
        })

        it('Spaces', async () => {
            await assertEqual('<p class="  working  "></p>', '<p class="working"></p>')
            await assertEqual('<p class="working"></p>', '<p class="  working  "></p>')
        })

        it('Ordering', async () => {
            await assertEqual('<p class="bourgeois working"></p>',
                '<p class="working bourgeois"></p>')
        })
    })
})
