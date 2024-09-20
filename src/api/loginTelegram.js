import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';
import { createSession } from '../session.js';

export async function post(db, { userId, body }) {
    if (userId !== null) return [400, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['code'], body);
    if (check) return [400, { error: check }];

    const [auth] = await dbGet(db, 'SELECT user_id FROM telegram_auth type = 0 AND WHERE code = ?', body.code);
    if (!auth || auth.telegram === null) return [404, { error: 'Код недействителен.' }];

    const [[token, expires]] = await Promise.all([
        dbGet(db, 'SELECT id FROM users WHERE telegram = ?', body.code).then(([user]) => createSession(db, user.id)),
        dbRun(db, 'DELETE FROM telegram_auth WHERE code = ?', body.code)
    ]);
    return [200, {}, {
        sessionToken: `${token}; Expires=${expires}`
    }];
}