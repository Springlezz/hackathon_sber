import { $addClasses, $append, $E, $remove, $style, $T } from '../scripts/dom.js';
import { getApi, postApi } from '../scripts/api.js';

async function regTg() {
    const r = await postApi('getTelegramCode', {type: 'register'});
}

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}