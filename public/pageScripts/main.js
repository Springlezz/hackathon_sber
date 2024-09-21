import { getApi } from '../api.js';
import { $addClasses, $append, $E, $remove, $style, $T } from '../dom.js';

function createCalendar(root) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Текущий месяц (0 - январь, 11 - декабрь)

    const firstDayOfMonth = new Date(year, month, 1); // Первый день месяца
    const lastDayOfMonth = new Date(year, month + 1, 0); // Последний день месяца

    let row = $E('tr', {}, []);

    const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Преобразование дня недели (чтобы Пн был 0)
    for (let i = 0; i < firstDayWeekday; i++) {
        $append(row, $E('td', {}, []));
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const td = $E('td', { id: 'day' + day, onClick: ()=>{selectDay(day)} }, [$T(day)]);
        $append(row, td);
        if (now.getDate() === day) {$addClasses(td, 'active');$addClasses(td, 'select_day')};
        if ((day + firstDayWeekday) % 7 === 0) {
            $append(root, row);
            row = $E('tr', {}, []);
        }
    }

    for (let i = 0; i < 7 - lastDayOfMonth.getDay(); i++) {
        $append(row, $E('td', {}, []));
    }
    $append(root, row);
}

createCalendar(document.getElementById('calendar-root'));

const de = document.querySelector('.day-events')
async function selectDay(day) {
    for (const e of document.querySelectorAll('td')) {
        e.className = e.className.replace(' select_day', '')
    }
    de.innerHTML = ''
    let cont = ''
    let ed = document.querySelector('#day'+day)
    ed.className = ed.className + ' select_day'
    for (const event of events) {
        const date = new Date(event.time * 1000);
        if (date.getDate() === day) {
            cont = date.toLocaleDateString('ru', {
                month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
            de.innerHTML += `<li><span>${cont}</span> ${event.title}</li>`
        };
    }
}

let events = []
async function setEventsDay(tags) {
    ({ events } = await getApi('getEvents', { timeStart: (Date.now()/1000|0)-86400*14, timeEnd: (Date.now()/1000|0)+86400*14, tags: tags.join(',') }));
    de.innerHTML = ''
    let cont = ''
    for (const event of events) {
        const date = new Date(event.time * 1000);
        if (date.getMonth() === new Date().getMonth()) {
            const elem = document.getElementById(`day${date.getDate()}`);
            if (elem.children.length) {
                const div = elem.querySelector('div');
                div.innerText = +div.innerText + 1;
            }
            else $append(elem, $E('div', { class: 'event_marker' }, [$T(1)]));
        }
        if (date.getDate() === new Date().getDate()) {
            cont = date.toLocaleDateString('ru', {
                month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            })
            de.innerHTML += `<li><span>${cont}</span> ${event.title}</li>`
        };
        if (event.time > Date.now()/1000|0) {
            $append(
                document.querySelector('#events>div.upcoming-events>ul'),
                $E('li', {}, [
                    $E('span', {}, $T(date.toLocaleDateString('ru', {
                        month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                    }))),
                    $T(' ' + event.title)
                ])
            );
        }
    }
}

let tags = [];
async function selectTag(tag) {
    for (const elem of document.getElementsByClassName('event_marker')) $remove(elem);

    if (tags.includes(tag)) {
        $style(document.getElementById(`tag${tag}`), 'borderColor', 'rgba(0,0,0,0)');
        tags.splice(tags.indexOf(tag), 1);
    }
    else {
        $style(document.getElementById(`tag${tag}`), 'borderColor', `rgba(${colors[tag]},1)`);
        tags.push(tag);
    }

    setEventsDay(tags);
}
setEventsDay([]);

const $filters = document.getElementById('filters');
document.getElementById('open-filters').addEventListener('click', function() {
    location.hash = location.hash === '#filters' ? '' : 'filters';
    $style($filters, 'opacity', location.hash === '#filters' ? 1 : 0);
});
$style($filters, 'opacity', location.hash === '#filters' ? 1 : 0);

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июнь', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
document.getElementById('month').textContent = months[new Date().getMonth()];

const colors = {};
getApi('getTags').then(function({ tags }) {
    for (const tag of tags) {
        colors[tag.id] = tag.color;
        const $tag = $E('p', {
            id: 'tag' + tag.id,
            onClick: () => selectTag(tag.id)
        }, [$T(tag.name)]);
        $style($tag, 'borderColor', `rgba(${tag.color},0)`);
        $style($tag, 'backgroundColor', `rgba(${tag.color},.2)`);
        $append($filters, $tag);
    }
});

function getValue(name) {
    return document.getElementsByName(name)[0].value;
}
