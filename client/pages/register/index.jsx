import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import inpStyles from '../../components/input.scss';
import Link from '../../components/link.jsx';
import { postApi } from '../../lib/api.js';

export default function Register({ setTitle, mainAppend, authorized, goPage }) {
    setTitle('Регистрация');

    const email = <input class={inpStyles.input} type="email" required />;
    const password = <input class={inpStyles.input} type="password" required />;
    const password2 = <input class={inpStyles.input} type="password" required />;

    const firstName = <input class={inpStyles.input} type="text" required />;
    const secondName = <input class={inpStyles.input} type="text" required />;
    const thirdName = <input class={inpStyles.input} type="text" />;

    const city = <input class={inpStyles.input} type="text" required />;
    const country = <input class={inpStyles.input} type="text" required />;

    const $error = <></>;
    const form = (
        <form class={formStyles.form}>
            <label class={formStyles.label}>Почта: {email}</label>
            <label class={formStyles.label}>Пароль: {password}</label>
            <label classes={[formStyles.label, formStyles.gap]}>Повторите пароль: {password2}</label>
            <label class={formStyles.label}>Имя: {firstName}</label>
            <label class={formStyles.label}>Фамилия: {secondName}</label>
            <label classes={[formStyles.label, formStyles.gap]}>Отчество: {thirdName}</label>
            <label class={formStyles.label}>Город: {city}</label>
            <label class={formStyles.label}>Страна: {country}</label>
            <div class={formStyles.error}>{$error}</div>
            <input type="submit" value="Зарегистрироваться" class={btnStyles.button} onClick={register} />
            <Link class={btnStyles.button} href="/register/telegram/" onClick={goPage}>Зарегистрироваться через Telegram</Link>
        </form>
    );

    async function register(event) {
        event.preventDefault();

        const { error } = await postApi('register', {
            email: email.value,
            password: password.value,
            password2: password2.value,
            firstName: firstName.value,
            secondName: secondName.value,
            thirdName: thirdName.value,
            city: city.value,
            country: country.value
        });
        $error.textContent = error || '';
        if (!error) {
            authorized(true);
            goPage('/');
        }
    }

    mainAppend(form);
}
