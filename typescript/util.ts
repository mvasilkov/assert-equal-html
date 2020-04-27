'use strict'

interface IEntities {
    [a: string]: { search: RegExp, replace: string }
}

const entities: IEntities = {
    '"': { search: /"/g, replace: '&quot;' },
    '&': { search: /&/g, replace: '&amp;' },
    '<': { search: /</g, replace: '&lt;' },
    '>': { search: />/g, replace: '&gt;' },
}

function _escape(replace: string[]): (str: string) => string {
    return str => {
        for (const a of replace) {
            str = str.replace(entities[a].search, entities[a].replace)
        }
        return str
    }
}

export const escapeAttr = _escape(['"', '&', '<', '>'])
export const escapeText = _escape(['&', '<', '>'])
