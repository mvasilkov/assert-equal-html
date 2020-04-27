'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const entities = {
    '"': { search: /"/g, replace: '&quot;' },
    '&': { search: /&/g, replace: '&amp;' },
    '<': { search: /</g, replace: '&lt;' },
    '>': { search: />/g, replace: '&gt;' },
};
function _escape(replace) {
    return str => {
        for (const a of replace) {
            str = str.replace(entities[a].search, entities[a].replace);
        }
        return str;
    };
}
exports.escapeAttr = _escape(['"', '&', '<', '>']);
exports.escapeText = _escape(['&', '<', '>']);
