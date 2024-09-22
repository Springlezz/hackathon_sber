import btnStyles from '../../components/button.scss';
import Link from '../../components/link.jsx';
import { getApi } from '../../lib/api.js';
import { $addClasses, $append, $clear, $hasClasses, $remove, $removeClasses, $style, $toggleClasses } from '../../lib/dom.js';
import styles from './styles.scss';

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июнь', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export default function Main({ setTitle, mainAppend, goPage }) {
    setTitle('Календарь событий');

    const $tags = <div class={styles.tags} />;
    const selectedTags = [];
    const calendar = <tbody />;
    const $month = <></>;
    const calendarMarkers = [];
    const $events = <div class={styles.events}></div>;
    let currentDay, $currentDay;

    function renderCalendar(date) {
        $clear(calendar);
        calendarMarkers.length = 0; // Очищаем маркеры

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;

        $month.textContent = `${months[month]}, ${year}`;

        let row = <tr />;

        for (let i = 0; i < firstDayWeekday; i++) {
            $append(row, <td />);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const marker = <div class={styles.marker} />;
            const thisDay = new Date(year, month, day);

            function click() {
                $removeClasses($currentDay, styles.active);
                $addClasses(td, styles.active);
                currentDay = thisDay;
                $currentDay = td;
                getEvents(currentDay);
            }

            const td = <td class={styles.day} onClick={click}>{day}{marker}</td>;

            if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
                $addClasses(td, styles.today);
            }
            if (+thisDay === +currentDay) {
                $addClasses(td, styles.active);
                $currentDay = td;
            }

            $append(row, td);
            calendarMarkers.push(marker);

            if ((day + firstDayWeekday) % 7 === 0) {
                $append(calendar, row);
                row = <tr />;
            }
        }

        for (let i = 0; i < 7 - lastDayOfMonth.getDay(); i++) {
            $append(row, <td />);
        }
        $append(calendar, row);
    }

    async function getEvents(date) {
        $clear($events);

        const { events } = await getApi('getEvents', {
            timeStart: new Date(date.getFullYear(), date.getMonth(), 1) / 1000 | 0,
            timeEnd: new Date(date.getFullYear(), date.getMonth() + 1, 0) / 1000 | 0,
            tags: selectedTags.join(',')
        });

        const dayEvents = [];
        for (const event of events) {
            const eventDate = new Date(event.time * 1000);
            const day = eventDate.getDate() - 1;
            if (dayEvents[day] > 0) dayEvents[day] += 1;
            else dayEvents[day] = 1;

            if (eventDate.getDate() !== date.getDate()) continue;

            const eventLocaleDate = eventDate.toLocaleDateString('ru', {
                month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });

            $append(
                $events,
                <Link class={styles.event} href={`/event/?id=${event.id}`} onClick={goPage}>
                    <div class={styles.title}>{event.title}</div>
                    <div class={styles.info}>{eventLocaleDate}, {event.duration / 60} минут, {event.location}</div>
                    <div class={styles.description}>{event.description}</div>
                </Link>
            );
        }
        for (const day in calendarMarkers) {
            if (dayEvents[day] > 0) {
                calendarMarkers[day].textContent = dayEvents[day];
                $addClasses(calendarMarkers[day], styles.show);
            }
            else $removeClasses(calendarMarkers[day], styles.show);
        }

        if (!dayEvents[date.getDate() - 1]) {
            $events.textContent = 'В этот день нет событий.';
        }
    }

    function changeDay(date) {
        currentDay = date;
        renderCalendar(date);
        getEvents(date);
    }
    changeDay(today);

    getApi('getTags').then(function({ tags }) {
        for (const tag of tags) {
            function click() {
                $toggleClasses($tag, 'selected');
                if ($hasClasses($tag, 'selected')) {
                    $style($tag, 'borderColor', `rgba(${tag.color},1)`);
                    selectedTags.push(tag.id);
                }
                else {
                    $style($tag, 'borderColor', '');
                    selectedTags.splice(selectedTags.indexOf(tag.id), 1);
                }
                changeDay(currentDay);
            }

            const $tag = <div onClick={click}>{tag.name}</div>;
            $style($tag, 'backgroundColor', `rgba(${tag.color},.2)`);
            $append($tags, $tag);
        }
    });

    mainAppend(
        <div class={styles.container}>
            <div class={styles.events}>
                <div class={styles.dateSelector}>
                    <button classes={[btnStyles.button]} onClick={() => changeDay(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1))}>&lt;</button>
                    <h3>{$month}</h3>
                    <button classes={[btnStyles.button]} onClick={() => changeDay(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1))}>&gt;</button>
                </div>
                <table class={styles.calendar}>
                    <thead>
                        <tr>
                            <th>Пн</th>
                            <th>Вт</th>
                            <th>Ср</th>
                            <th>Чт</th>
                            <th>Пт</th>
                            <th>Сб</th>
                            <th>Вс</th>
                        </tr>
                    </thead>
                    {calendar}
                </table>
                <h3>События в этот день</h3>
                {$events}
            </div>
            <div class={styles.filter}>
                <h3>Фильтр по тегам</h3>
                {$tags}
            </div>
        </div>
    );
}