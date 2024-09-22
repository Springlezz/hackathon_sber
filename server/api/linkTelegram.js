import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['code'], body);
    if (check) return [400, { error: check }];

    const [auth] = await dbGet(db, 'SELECT telegram FROM telegram_auth WHERE type = 2 AND code = ?', body.code);
    if (!auth || auth.telegram === null) return [404, { error: 'Код недействителен.' }];

    await Promise.all([
        dbRun(db, 'UPDATE users SET telegram = ? WHERE id = ?', auth.telegram, userId),
        dbRun(db, 'DELETE FROM telegram_auth WHERE code = ?', body.code)
    ]);
    return [200, {}];
}