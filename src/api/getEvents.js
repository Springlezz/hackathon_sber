import checkProps from '../checkProps.js';
import { dbAll } from '../db.js';
import { isNoNegInt } from '../utils.js';

export async function get(db, { search }) {
    const check = checkProps(['tags'], search);
    if (check) return [400, { error: check }];

    let sql = 'SELECT events.title, events.description, events.time, events.location FROM events';
    let eventTags = [];
    if (search.tags) {
        eventTags = search.tags.split(',');
        for (const tag of eventTags) {
            if (!isNoNegInt(tag)) return [400, { error: 'Неверный идентификатор тега.' }];
        }
        sql += `
            JOIN event_tags ON events.id = event_tags.event_id
            WHERE event_tags.tag_id IN (${eventTags.map(() => '?').join(', ')})
        `;
    }
    else {
        const [events] = await dbAll(db, sql, ...eventTags);
        return [200, { events }];
    }
}