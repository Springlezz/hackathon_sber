import { postApi } from '../api.js';

async function regTg() {
    const r = await postApi('getTelegramCode', {type: 'register'});
}

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}