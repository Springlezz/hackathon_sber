import { $addClasses, $append, $E, $remove, $style, $T } from '../dom.js';
import { getApi, postApi } from '../api.js';
import { createDialog } from '../scripts/dialog.js';

async function regTg() {
    const r = await getApi('getTelegramCode', {type: 'register'});
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
                $T(` в телеграмм следующий код: "${r.code}"`),
                $E('b',{},[]),

                $E('label',{}, [ $T('Имя'), $E('input',{name: 'tg-firstName', required: true},[])]),
                $E('label',{}, [ $T('Фамилия'), $E('input',{name: 'tg-secondName', required: true},[])]),
                $E('label',{}, [ $T('Отчество'), $E('input',{name: 'tg-thirdName'},[])]),
                $E('label',{}, [ $T('Страна'), $E('input',{name: 'tg-country', required: true},[])]),
                $E('label',{}, [ $T('Город'), $E('input',{name: 'tg-city', required: true},[])])
                ], {'Продолжить': ()=>regTgg(r.code), 'Закрыть': ()=>d.remove()}));
    }
}

async function regTgg(code) {
    let firstName = document.querySelector('input[name="tg-firstName"]').value
    let secondName = document.querySelector('input[name="tg-secondName"]').value
    let thirdName = document.querySelector('input[name="tg-thirdName"]').value
    let country = document.querySelector('input[name="tg-country"]').value
    let city = document.querySelector('input[name="tg-city"]').value
    const r = await postApi('registerTelegram', {code,firstName,secondName,thirdName,country,city});
    if (r.error) {
        alert(r.error);
    } else {
        location = '/'
    }
}

document.getElementById('linkTg').onclick = regTg;

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}