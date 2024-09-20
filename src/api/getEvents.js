import checkProps from '../checkProps.js';
import { dbGet } from '../db.js';
import { isNoNegInt } from '../utils.js';

export async function get(db, { search }) {
    const check = checkProps(['tags'], search);
    if (check) return [400, { error: check }];

    const eventTags = search.split(',');
    for (const tag of eventTags) {
        if (!isNoNegInt(tag)) return [401, { error: 'Неверный идентификатор тега.' }];
    }

    const sql = `
        SELECT * FROM events
        JOIN events ON events.id = event_tags.event_id
        WHERE event_tags.tag_id IN (${eventTags.map(() => '?').join(', ')})
    `;
    const events = await dbGet(db, sql, ...eventTags);
    return [200, { events }];
}