import { $E, $T, $append, $clear, $toggleClasses } from './dom.js';
import { getApi } from './api.js';

const $auth = document.getElementById('auth');

function authShowUser(info) {
    $clear($auth);
    const menu = $E('div', { id: 'menu' }, [
        $E('button', { onClick: () => location.href = '/profile/' }, [$T('Профиль')]),
        $E('button', {}, [$T('Мои события')]),
        $E('button', {}, [$T('Настройки')]),
        $E('button', {
            onClick() {
                getApi('logout');
                authShowButtons();
            }
        }, [$T('Выход')])
    ]);
    $append(
        $auth,
        $E('button', { onClick: () => $toggleClasses(menu, 'show') }, [$T(`${info.firstName} ${info.secondName}`)]),
        menu
    );
}
function authShowButtons() {
    $clear($auth);
    $auth.append(
        $E('button', { onClick: () => location.href = '/login/' }, [$T('Вход')]),
        $E('button', { onClick: () => location.href = '/register/' }, [$T('Регистрация')])
    );
}

getApi('getUserInfo').then(function(info) {
    if (info.error) authShowButtons();
    else authShowUser(info);
});