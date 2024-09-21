import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';
import { createSession } from '../session.js';

export async function post(db, { userId, body }) {
    if (userId !== null) return [400, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['code', 'firstName', 'secondName', 'thirdName', 'country', 'city'], body);
    if (check) return [400, { error: check }];

    const [auth] = await dbGet(db, 'SELECT telegram FROM telegram_auth WHERE type = 1 AND code = ?', body.code);
    if (!auth || auth.telegram === null) return [404, { error: 'Код недействителен.' }];

    const [, { lastID }] = await dbRun(db, 'INSERT INTO users (first_name, second_name, third_name, country, city, telegram) VALUES (?, ?, ?, ?, ?, ?)', body.firstName, body.secondName, body.thirdName, body.country, body.city, auth.telegram);

    const [[token, expires]] = await Promise.all([
        createSession(db, lastID),
        dbRun(db, 'DELETE FROM telegram_auth WHERE code = ?', body.code)
    ]);
    return [200, {}, {
        sessionToken: `${token}; Expires=${expires}`
    }];
}