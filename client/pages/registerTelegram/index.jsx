import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import Link from '../../components/link.jsx';
import { getApi, postApi } from '../../lib/api.js';
import { $append, $clear, $E } from '../../lib/dom.js';

export default function RegisterTelegram({ setTitle, mainAppend, authorized, goPage }) {
    setTitle('Регистрация через Telegram');

    let code;

    const firstName = <input type="text" required />;
    const secondName = <input type="text" required />;
    const thirdName = <input type="text" />;

    const city = <input type="text" required />;
    const country = <input type="text" required />;

    const info = <div>Загрузка...</div>;
    const $error = <></>;
    const submit = <input class={btnStyles.button} type="submit" value="Продолжить" onClick={login} style="display:none" />;
    const form = (
        <form class={formStyles.form}>
            {info}
            <label>Имя: {firstName}</label>
            <label>Фамилия: {secondName}</label>
            <label class={formStyles.gap}>Отчество: {thirdName}</label>
            <label>Город: {city}</label>
            <label>Страна: {country}</label>
            <div class={formStyles.error}>{$error}</div>
            {submit}
            <Link class={btnStyles.button} href="/register/" onClick={goPage}>Зарегистрироваться с паролем</Link>
        </form>
    );

    getApi('getTelegramCode', { type: 'register' }).then(function({ error, code: c }) {
        $clear(info);
        if (error) $error.textContent = error;
        else {
            $clear($error);
            $append(info, <>Напишите <a href="https://t.me/hakatonkrona_bot" target="_blank">боту</a> в телеграмм следующий код: "{c}"</>);
            submit.style.display = '';
            code = c;
        }
    });

    async function login(event) {
        event.preventDefault();

        const { error } = await postApi('registerTelegram', {
            code,
            firstName: firstName.value,
            secondName: secondName.value,
            thirdName: thirdName.value,
            city: city.value,
            country: country.value
        });
        if (error) $error.textContent = 'Вы не ввели код в Telegram.';
        else {
            authorized(true);
            goPage('/');
        }
    }

    mainAppend(form);
}
