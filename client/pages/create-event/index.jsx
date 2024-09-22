import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import { postApi } from '../../lib/api.js';

export default function CreateEvent({ setTitle, mainAppend }) {
    setTitle('Создание события');

    const title = <input type="text" required />;
    const description = <textarea required />;
    const location = <input type="text" required />;
    const date = <input type="date" required />;
    const time = <input type="time" required />;
    const duration = <input type="number" required />;
    const tags = <input type="text" />;

    const $error = <></>;
    const form = (
        <form class={formStyles.form}>
            <label>Название: {title}</label>
            <label>Описание: {description}</label>
            <label>Локация: {location}</label>
            <label>Дата: {date}</label>
            <label>Время: {time}</label>
            <label>Длительность (мин): {duration}</label>
            <label>Теги (через запятую): {tags}</label>
            <div class={formStyles.error}>{$error}</div>
            <input type="submit" value="Создать событие" class={btnStyles.button} onClick={create} />
        </form>
    );

    async function create(event) {
        event.preventDefault();

        const { error } = await postApi('createEvent', {
            title: title.value,
            description: description.value,
            location: location.value,
            date: new Date(date.value + ' ' + time.value).getTime() / 1000 | 0,
            duration: duration.value * 60,
            tags: tags.value
        });
        $error.textContent = error || '';
        if (!error) form.textContent = 'Событие создано!';
    }

    mainAppend(form);
}
