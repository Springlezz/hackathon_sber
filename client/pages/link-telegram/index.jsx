import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import { getApi, postApi } from '../../lib/api.js';
import { $append, $clear, $E } from '../../lib/dom.js';

export default function LoginTelegram({ setTitle, mainAppend, authorized, goPage }) {
    setTitle('Привязка Telegram');

    let code;

    const info = <div>Загрузка...</div>;
    const $error = <></>;
    const submit = <input class={btnStyles.button} type="submit" value="Продолжить" onClick={login} style="display:none" />;
    const form = (
        <form class={formStyles.form}>
            {info}
            <div class={formStyles.error}>{$error}</div>
            {submit}
        </form>
    );

    getApi('getTelegramCode', { type: 'link' }).then(function({ error, code: c }) {
        $clear(info);
        if (error) $error.textContent = error;
        else {
            $clear($error);
            $append(info, <>Напишите <a href="https://t.me/hakatonkrona_bot" target="_blank">боту</a> в телеграмм следующий код: «{c}»</>);
            submit.style.display = '';
            code = c;
        }
    });

    async function login(event) {
        event.preventDefault();

        const { error } = await postApi('linkTelegram', { code });
        if (error) $error.textContent = 'Вы не ввели код в Telegram.';
        else goPage('/settings/');
    }

    mainAppend(form);
}