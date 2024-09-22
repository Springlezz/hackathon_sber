import btnStyles from '../../components/button.scss';
import { getApi, postApi } from '../../lib/api.js';
import { $remove } from '../../lib/dom.js';
import styles from './styles.scss';

export default async function Event({ setTitle, mainAppend }) {
    setTitle('Просмотр события');

    const info = <div>Загрузка...</div>;
    mainAppend(info);

    const eventId = new URL(location).searchParams.get('id');
    if (!eventId) {
        info.textContent = 'Событие не найдено.';
        return;
    }

    const [event, { tags }] = await Promise.all([
        getApi('getEvent', { id: eventId }),
        getApi('getTags'),
    ]);
    if (event.error) {
        info.textContent = event.error;
        return;
    }
    $remove(info);

    setTitle(`Событие «${event.title}»`);

    const eventDate = new Date(event.time * 1000).toLocaleDateString('ru', {
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });

    mainAppend(
        <div class={styles.info}>
            <div><b>Дата:</b> {eventDate}</div>
            <div><b>Длительность:</b> {event.duration / 60} минут</div>
            <div><b>Локация:</b> {event.location}</div>
            <div class={styles.tags}>{event.tags.map(tag => tags.find(t => t.id === tag)).map(tag => <span style={`background-color:rgba(${tag.color},.2)`}>{tag.name}</span>)}</div>
        </div>
    );
    mainAppend(<div class={styles.description}>{event.description}</div>);

    async function join() {
        const { error } = await postApi('joinEvent', { id: eventId });
        if (error) return alert(error);
        $remove(joinBtn);
        mainAppend(leaveBtn);
    }
    async function leave() {
        const { error } = await postApi('leaveEvent', { id: eventId });
        if (error) return alert(error);
        $remove(leaveBtn);
        mainAppend(joinBtn);
    }

    const joinBtn = <button classes={[btnStyles.button, styles.button]} onClick={join}>Принять участие</button>;
    const leaveBtn = <button classes={[btnStyles.button, styles.button]} onClick={leave}>Отменить участие</button>;

    if (event.hasOwnProperty('joined')) {
        mainAppend(event.joined ? leaveBtn : joinBtn);
    }
    else if (event.confirmed === false) {
        function confirm() {
            const { error } = postApi('confirmEvent', { id: eventId, accepted: true });
            if (error) return alert(error);
            $remove(confirmBtn);
            $remove(cancelBtn);
            mainAppend(joinBtn);
        }
        function cancel() {
            const { error } = postApi('confirmEvent', { id: eventId, accepted: false });
            if (error) return alert(error);
            $remove(confirmBtn);
            $remove(cancelBtn);
        }

        const confirmBtn = <button classes={[btnStyles.button, styles.button]} onClick={confirm}>Подтвердить событие</button>;
        const cancelBtn = <button classes={[btnStyles.button, styles.button]} onClick={cancel}>Отклонить событие</button>;
        mainAppend([confirmBtn, cancelBtn]);
    }
};