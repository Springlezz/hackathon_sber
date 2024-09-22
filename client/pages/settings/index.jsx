import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import inpStyles from '../../components/input.scss';
import { getApi, postApi } from '../../lib/api.js';
import { $append } from '../../lib/dom.js';

export default function Settings({ setTitle, mainAppend, authorized, goPage }) {
    setTitle('Настройки');

    const email = <input class={inpStyles.input} type="email" required />;

    const firstName = <input class={inpStyles.input} type="text" required />;
    const secondName = <input class={inpStyles.input} type="text" required />;
    const thirdName = <input class={inpStyles.input} type="text" />;

    const city = <input class={inpStyles.input} type="text" required />;
    const country = <input class={inpStyles.input} type="text" required />;

    const tgNotifications = <input class={inpStyles.checkbox} type="checkbox" />;
    const tgNotificationsLabel = <label class={formStyles.label} style="display:none">Уведомления в Telegram: {tgNotifications}</label>;

    const $error = <></>;
    const form = (
        <form class={formStyles.form}>
            <label classes={[formStyles.label, formStyles.gap]}>Почта: {email}</label>
            <label class={formStyles.label}>Имя: {firstName}</label>
            <label class={formStyles.label}>Фамилия: {secondName}</label>
            <label classes={[formStyles.label, formStyles.gap]}>Отчество: {thirdName}</label>
            <label class={formStyles.label}>Город: {city}</label>
            <label classes={[formStyles.label, formStyles.gap]}>Страна: {country}</label>
            {tgNotificationsLabel}
            <div class={formStyles.error}>{$error}</div>
            <input type="submit" value="Сохранить" class={btnStyles.button} onClick={register} />
        </form>
    );

    getApi('getUserInfo').then(function(info) {
        if (info.error) {
            $error.textContent = error;
            return;
        }
        else {
            email.value = info.email;
            firstName.value = info.firstName;
            secondName.value = info.secondName;
            thirdName.value = info.thirdName;
            city.value = info.city;
            country.value = info.country;
            if (info.linkedTelegram) {
                tgNotificationsLabel.style.display = '';
                tgNotifications.checked = info.telegramNotifications;
            }
        }
    });

    async function register(event) {
        event.preventDefault();

        const { error } = await postApi('changeSettings', {
            email: email.value,
            firstName: firstName.value,
            secondName: secondName.value,
            thirdName: thirdName.value,
            city: city.value,
            country: country.value,
            telegramNotifications: tgNotifications.checked
        });
        $error.textContent = error || '';
        if (!error) {
            form.textContent = 'Настройки сохранены!';
            $append(form, <button class={btnStyles.button} onClick={() => goPage('/settings/')}>Вернуться</button>);
            authorized(true);
        }
    }

    mainAppend(form);
}
