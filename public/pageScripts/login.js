import { $addClasses, $append, $E, $remove, $style, $T } from '../dom.js';
import { getApi, postApi } from '../api.js';
import { createDialog } from '../scripts/dialog.js';

async function sendCode() {
    const r = await getApi('getTelegramCode', {type: 'login'});
    if (r.error) {
        alert(r.error);
    } else {
        let d = document.createElement('div')
        d.id='dialog-back'
        document.querySelector('body').prepend(d)
        $append(d,
            createDialog([
                $T('Напишите боту '),
                $E('a',{href: 'https://t.me/hakatonkrona_bot'},[$T('@hakatonkrona_bot')]),
                $T(` в телеграмм следующий код: "${r.code}" и нажмите кнопки "Продолжить"`),
                ], {'Продолжить': ()=>loginTg(r.code)}));
    }
}

async function loginTg(code) {
    const r = await postApi('loginTelegram', {code});
    if (r.error) {
        alert(r.error);
    } else {
        location = '/'
    }
}

document.getElementById('linkTg').onclick = sendCode;

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}