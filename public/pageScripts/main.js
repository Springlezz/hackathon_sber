function createCalendar(root) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Текущий месяц (0 - январь, 11 - декабрь)

    const firstDayOfMonth = new Date(year, month, 1); // Первый день месяца
    const lastDayOfMonth = new Date(year, month + 1, 0); // Последний день месяца

    let row = document.createElement('tr');

    const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Преобразование дня недели (чтобы Пн был 0)
    for (let i = 0; i < firstDayWeekday; i++) {
        row.appendChild(document.createElement('td'));
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const td = document.createElement('td');
        td.id = 'day' + day;
        if (now.getDate() === day) { td.className = td.className + 'active'; }
        td.textContent = day;
        row.appendChild(td);
        if ((day + firstDayWeekday) % 7 === 0) {
            root.appendChild(row);
            row = document.createElement('tr');
        }
    }

    for (let i = 0; i < 7 - lastDayOfMonth.getDay(); i++) {
        const td = document.createElement('td');
        row.appendChild(td);
    }
    root.appendChild(row);
}

createCalendar(document.getElementById('calendar-root'));

async function setEventsDay(tags) {
    const b = await getApi('getEvents', {tags: tags.join(','), timeStart: (Date.now()/1000|0)-86400*14, timeEnd: (Date.now()/1000|0)+86400*14});
    for (const e of b.events) {
        let d = new Date(e.time_created * 1000);
        if (d.getDate()===new Date().getDate() && d.getMonth()===new Date().getMonth()) {
            if ($(`#day${d.getDate()}`).children().length===0) {
                $(`#day${d.getDate()}`).append($('<div>').addClass('event_marker').text(1))
            } else {
                $(`#day${d.getDate()}>div`).text($(`#day${d.getDate()}>div`).text()+1)
            }
        }
        if (e.time_created > Date.now()/1000|0) { $('#events>div.upcoming-events>ul').append($('<li>').append($('<span>').text(d.toLocaleDateString('ru', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }))).text(e.title)); }
    }
}

let tags = [];
async function selectTag(tag) {
    $('.event_marker').remove();
    if (tags.includes(tag)) { $(`#tag${tag}`).css({ borderColor: 'rgba(0,0,0,0)' }); tags.splice(tags.indexOf(tag), 1); } else { tags.push(tag); $(`#tag${tag}`).css({ borderColor: `rgba(${colors[tag]},1)` }); }
    setEventsDay(tags);
}

let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июнь', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
$('#month').text(months[new Date().getMonth()])

function clickFilters() {
    if (location.hash === '#filters') { location.hash = ''; } else { location.hash = 'filters'; }
}

setEventsDay([]);

let colors = {};
getApi('getTags').then(function(b) {
    for (let e of b.tags) { colors[e.id] = e.color; $('#filters').append($('<p>').attr('id', 'tag' + e.id).text(e.name).click(() => selectTag(e.id)).css({ borderColor: `rgba(${e.color},0)`, backgroundColor: `rgba(${e.color},.2)` })); }
});