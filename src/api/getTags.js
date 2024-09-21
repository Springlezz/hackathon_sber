import { dbAll } from '../db.js';

export async function get(db) {
    const [tags] = await dbAll(db, 'SELECT * FROM tags');
    return [200, { tags }];
}