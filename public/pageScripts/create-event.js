import { getApi, postApi } from '../api.js';
import { $addClasses, $append, $E, $remove, $style, $T } from '../dom.js';

async function createEvent() {
    const title = getValue('title');
    const description = getValue('description');
    let location = '';
    for (const i of document.getElementsByName('radiobutton')) {
        if (i.checked) location = i.value
    }
    const now = new Date();
    let date = getValue('date')
    const month = date.replace('/','.').split('.')[1]
    date = date.replace('/','.').split('.')[0]
    let t = getValue('time').replace(':','.').split('.')
    const time = new Date(now.getFullYear(), month-1, date, t[0], t[1]);
    const duration = getValue('duration')*3600;
    const r = await postApi('createEvent', { title, description, location, time:+time/1000|0, duration, tags});
    if (r.error) {alert(r.error);} else {
        let d = document.createElement('div')
        d.id='dialog-back'
        document.querySelector('body').prepend(d)
        $append(d,
            createDialog([
                $T('Событие создано!'),
                ], {'Закрыть': ()=>d.remove()}));
    }
}

document.getElementById('create').onclick = createEvent;

const $filters = document.getElementById('createEvent');
let tags = [];
async function selectTag(tag) {
    if (tags.includes(tag)) {
        $style(document.getElementById(`tag${tag}`), 'borderColor', 'rgba(0,0,0,0)');
        tags.splice(tags.indexOf(tag), 1);
    }
    else {
        $style(document.getElementById(`tag${tag}`), 'borderColor', `rgba(${colors[tag]},1)`);
        tags.push(tag);
    }
}

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