import btnStyles from '../../components/button.scss';
import formStyles from '../../components/form.scss';
import inpStyles from '../../components/input.scss';
import { postApi } from '../../lib/api.js';

export default function CreateEvent({ setTitle, mainAppend }) {
    setTitle('Создание события');

    const title = <input class={inpStyles.input} type="text" required />;
    const description = <textarea class={inpStyles.input} required />;
    const location = <input class={inpStyles.input} type="text" required />;
    const date = <input class={inpStyles.input} type="date" required />;
    const time = <input class={inpStyles.input} type="time" required />;
    const duration = <input class={inpStyles.input} type="number" required />;
    const tags = <input class={inpStyles.input} type="text" />;

    const $error = <></>;
    const form = (
        <form class={formStyles.form}>
            <label class={formStyles.label}>Название: {title}</label>
            <label class={formStyles.label}>Описание: {description}</label>
            <label class={formStyles.label}>Локация: {location}</label>
            <label class={formStyles.label}>Дата: {date}</label>
            <label class={formStyles.label}>Время: {time}</label>
            <label class={formStyles.label}>Длительность (мин): {duration}</label>
            <label class={formStyles.label}>Теги (через запятую): {tags}</label>
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
            time: new Date(date.value + ' ' + time.value).getTime() / 1000 | 0,
            duration: duration.value * 60,
            tags: tags.value
        });
        $error.textContent = error || '';
        if (!error) form.textContent = 'Событие создано!';
    }

    mainAppend(form);
}
