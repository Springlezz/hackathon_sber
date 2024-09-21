import { getApi } from './lib/api.js';
import { $append, $clear, $toggleClasses } from './lib/dom.js';

const $auth = document.getElementById('auth');

function authShowUser(info) {
    $clear($auth);
    const menu = (
        <div id="menu">
            <button onClick={() => location.href = '/profile/'}>Профиль</button>
            <button onClick={() => location.href = '/my-events/'}>Мои события</button>
            <button onClick={() => location.href = '/settings/'}>Настройки</button>
            <button onClick={function() {
                getApi('logout');
                authShowButtons();
            }}>Выход</button>
        </div>
    );
    $append(
        $auth,
        <button onClick={() => $toggleClasses(menu, 'show')}>{info.firstName} {info.secondName}</button>,
        menu
    );
}
function authShowButtons() {
    $clear($auth);
    $auth.append(
        <button onClick={() => location.href = '/login/'}>Вход</button>,
        <button onClick={() => location.href = '/register/'}>Регистрация</button>
    );
}

getApi('getUserInfo').then(function(info) {
    if (info.error) {authShowButtons();document.querySelector('.buttons>a').remove()}
    else {
        authShowUser(info);
        if (info.role!==1) document.querySelector('.buttons>a').remove();
    }
});