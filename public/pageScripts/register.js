import { $addClasses, $append, $E, $remove, $style, $T } from '../scripts/dom.js';
import { getApi, postApi } from '../scripts/api.js';
import { createDialog } from '../scripts/dialog.js';

async function regTg() {
    const r = await getApi('getTelegramCode', {type: 'register'});
    if (r.error) {
        alert(r.error);
    } else {
        createDialog([$T('Напишите боту '), $E('a',{href: 'https://t.me/hakatonkrona_bot'},[$T('@hakatonkrona_bot')]), $T(` в телеграмм следующий код: "${r.code}"`)], {'OK': 'check'});
    }
}

document.getElementById('linkTg').onclick = regTg;

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}