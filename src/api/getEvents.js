import checkProps from '../checkProps.js';
import { dbAll } from '../db.js';
import { isNoNegInt } from '../utils.js';

export async function get(db, { search }) {
    const check = checkProps(['tags'], search);
    if (check) return [400, { error: check }];

    if (search.tags) {
        const eventTags = search.tags.split(',');
        for (const tag of eventTags) {
            if (!isNoNegInt(tag)) return [401, { error: 'Неверный идентификатор тега.' }];
        }

        const sql = `
            SELECT events.* FROM events
            JOIN event_tags ON events.id = event_tags.event_id
            WHERE event_tags.tag_id IN (${eventTags.map(() => '?').join(', ')})
        `;
        const [events] = await dbAll(db, sql, ...eventTags);
        return [200, { events }];
    }
    else {
        const [events] = await dbAll(db, 'SELECT * FROM events');
        return [200, { events }];
    }
}