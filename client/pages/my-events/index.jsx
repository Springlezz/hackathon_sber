import Event from '../../components/event/index.jsx';
import { getApi } from '../../lib/api.js';
import { $append, $clear } from '../../lib/dom.js';

export default function MyEvents({ setTitle, mainAppend, goPage }) {
    setTitle('Мои события');

    const $events = <div>Загрузка...</div>;
    mainAppend($events);

    getApi('getUserEvents').then(function({ error, events }) {
        if (error) {
            $events.textContent = error;
            return;
        }
        if (events.length === 0) {
            $events.textContent = 'У вас нет событий.';
            return;
        }

        $clear($events);
        for (const event of events) {
            $append($events, Event(event, goPage));
        }
    });
}