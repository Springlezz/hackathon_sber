import { getApi, postApi } from '../api.js';
import { $append, $E, $T } from '../dom.js';

const c = document.getElementById('content');
const userInfo = await getApi('getUserInfo');
if (userInfo.linkedTelegram) {
    let e = document.createElement('label');
    e.innerHTML = 'Уведомления в Телеграмм: <input type="checkbox" name="notice">';
    c.insertBefore(e, document.getElementById('saveChanges'));
} else {
    e = document.createElement('button');
    e.onclick = linkTg
    e.innerText = 'Привязать телеграмм';
    c.append(e);
}

async function linkTg() {
    const r = await getApi('');
}

async function saveSettings() {
    const email = getValue('email');
    const firstName = getValue('firstName');
    const secondName = getValue('secondName');
    const thirdName = getValue('thridName');
    const country = getValue('country');
    const city = getValue('city');
    let notice = 0;
    if (document.getElementsByName('notice').length) notice = getValue('notice');
    const r = await postApi('changeSettings', { email, firstName, secondName, thirdName, country, city, telegramNotifications: notice });
}

async function changePassword() {
    const oldPassword = getValue('old_password');
    const password = getValue('new_password');
    const password2 = getValue('new_password2');

    if (password !== password2) { alert('Новый пароль не совпадает с повторением во втором поле'); } else {
        if (password === oldPassword) { alert('Новый пароль совпадает со старым паролем'); } else {
            const r = await postApi('changePassword', { oldPassword, password, password2 });
        }
    }
}

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}