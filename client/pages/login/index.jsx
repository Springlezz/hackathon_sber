import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import Link from '../../components/link.jsx';
import { postApi } from '../../lib/api.js';

export default function Login({ setTitle, mainAppend, authorized, goPage }) {
    setTitle('Вход');

    const email = <input type="email" required />;
    const password = <input type="password" required />;

    const $error = <></>;
    const form = (
        <form class={formStyles.form}>
            <label>Почта: {email}</label>
            <label>Пароль: {password}</label>
            <div class={formStyles.error}>{$error}</div>
            <input class={btnStyles.button} type="submit" value="Войти" onClick={login} />
            <Link class={btnStyles.button} href="/login/telegram/" onClick={goPage}>Войти через Telegram</Link>
        </form>
    );

    async function login(event) {
        event.preventDefault();

        const { error } = await postApi('login', { email: email.value, password: password.value });
        $error.textContent = error || '';
        if (!error) {
            authorized(true);
            goPage('/');
        }
    }

    mainAppend(form);
}
