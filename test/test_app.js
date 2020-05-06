'use strict'

const { describe, it } = require('smoltest')(exports)

const { assertEqual, assertNotEqual } = require('..')

it('Usage', () => {
    assertEqual(
        '<button type="button" class="btn btn-link">Link</button>',
        '<button class="btn-link btn" type="button">Link</button>')
})

describe('Sanity', () => {
    describe('Text', () => {
        it('Identity', () => {
            assertEqual('', '')
            assertEqual('утречко', 'утречко')
            assertNotEqual('утречко', 'волночки')
        })

        it('Empty', () => {
            assertNotEqual('утречко', '')
            assertNotEqual('', 'утречко')
        })

        it('Spaces', () => {
            assertEqual('  утречко  ', 'утречко')
            assertEqual('утречко', '  утречко  ')
        })

        it('Case Folding', () => {
            assertNotEqual('УТРЕЧКО', 'утречко')
            assertNotEqual('утречко', 'УТРЕЧКО')
        })
    })

    describe('HTML', () => {
        it('Identity', () => {
            assertEqual('<p></p>', '<p></p>')
            assertEqual('<p>волночки</p>', '<p>волночки</p>')
            assertNotEqual('<p>волночки</p>', '<p>утречко</p>')
        })

        it('Empty', () => {
            assertNotEqual('<p>волночки</p>', '<p></p>')
            assertNotEqual('<p></p>', '<p>волночки</p>')
        })

        it('Spaces', () => {
            assertEqual('  <p>  волночки  </p>  ', '<p>волночки</p>')
            assertEqual('<p>волночки</p>', '  <p>  волночки  </p>  ')
        })

        it('Case Folding', () => {
            assertEqual('<P>волночки</P>', '<p>волночки</p>')
            assertEqual('<p>волночки</p>', '<P>волночки</P>')
            assertNotEqual('<p>ВОЛНОЧКИ</p>', '<p>волночки</p>')
            assertNotEqual('<p>волночки</p>', '<p>ВОЛНОЧКИ</p>')
        })

        it('Trailing Text', () => {
            assertNotEqual('<p>утречко</p>волночки', '<p>утречко</p>')
            assertNotEqual('<p>утречко</p>', '<p>утречко</p>волночки')
        })
    })

    describe('Self-Closing Tags', () => {
        it('Identity', () => {
            assertEqual('<input />', '<input />')
            assertEqual('<input>', '<input>')
            assertEqual('<input />', '<input>')
            assertEqual('<input>', '<input />')
            assertNotEqual('<input />', '<input></input>')
            assertNotEqual('<input>', '<link>')
        })

        it('Spaces', () => {
            assertEqual('<input />', '<input/>')
            assertEqual('<input/>', '<input />')
            assertEqual('  <input  />  ', '<input />')
            assertEqual('<input />', '  <input  />  ')
        })

        it('Case Folding', () => {
            assertEqual('<INPUT />', '<input />')
            assertEqual('<input />', '<INPUT />')
            assertEqual('<INPUT>', '<input>')
            assertEqual('<input>', '<INPUT>')
        })

        it('Trailing Text', () => {
            assertEqual('утречко<input>волночки', 'утречко<input />волночки')
            assertEqual('утречко<input />волночки', 'утречко<input>волночки')
        })
    })

    describe('Attributes', () => {
        it('Identity', () => {
            assertEqual('<p autocapitalize></p>', '<p autocapitalize></p>')
            assertEqual('<p lang="ru"></p>', '<p lang="ru"></p>')
            assertNotEqual('<p lang="ru"></p>', '<p lang="zh"></p>')
        })

        it('Empty', () => {
            assertNotEqual('<p lang="ru"></p>', '<p lang=""></p>')
            assertNotEqual('<p lang=""></p>', '<p lang="ru"></p>')
        })

        it('Spaces', () => {
            assertNotEqual('<p lang="  ru  "></p>', '<p lang="ru"></p>')
            assertNotEqual('<p lang="ru"></p>', '<p lang="  ru  "></p>')
        })

        it('Case Folding', () => {
            assertEqual('<p LANG="ru"></p>', '<p lang="ru"></p>')
            assertEqual('<p lang="ru"></p>', '<p LANG="ru"></p>')
            assertNotEqual('<p lang="RU"></p>', '<p lang="ru"></p>')
            assertNotEqual('<p lang="ru"></p>', '<p lang="RU"></p>')
        })

        it('Ordering', () => {
            assertEqual('<p lang="ru" autocapitalize></p>',
                '<p autocapitalize lang="ru"></p>')
            assertNotEqual('<input tabindex="2" tabindex="1">',
                '<input tabindex="1" tabindex="2">')
        })
    })

    describe('Classes', () => {
        it('Identity', () => {
            assertEqual('<p class></p>', '<p class></p>')
            assertEqual('<p class="working"></p>', '<p class="working"></p>')
        })

        it('Empty', () => {
            assertNotEqual('<p class="working"></p>', '<p class=""></p>')
            assertNotEqual('<p class=""></p>', '<p class="working"></p>')
        })

        it('Spaces', () => {
            assertEqual('<p class="  working  "></p>', '<p class="working"></p>')
            assertEqual('<p class="working"></p>', '<p class="  working  "></p>')
        })

        it('Case Folding', () => {
            assertNotEqual('<p class="WORKING"></p>', '<p class="working"></p>')
            assertNotEqual('<p class="working"></p>', '<p class="WORKING"></p>')
        })

        it('Ordering', () => {
            assertEqual('<p class="bourgeois working"></p>',
                '<p class="working bourgeois"></p>')
        })
    })
})
