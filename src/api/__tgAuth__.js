import checkProps from '../checkProps.js';
import { API_KEY } from '../consts.js';
import { dbGet, dbRun } from '../db.js';

export async function get(db, { search }) {
    const check = checkProps(['key', 'code', 'id'], search);
    if (check) return [400, { error: check }];

    if (search.key !== API_KEY) return [401, { error: 'Неверный ключ API.' }];

    const [auth] = dbGet(db, 'SELECT type, telegram FROM telegram_auth WHERE code = ?', search.code);
    if (!auth) return [404, { error: 'Код недействителен.' }];
    if (auth.telegram !== null) return [400, { error: 'Вы уже вводили код.' }];

    const [user] = await dbGet(db, 'SELECT id FROM users WHERE telegram = ?', search.id);
    if (auth.type === 0) { // login
        if (!user) {
            await dbRun(db, 'DELETE FROM telegram_auth WHERE code = ?', search.code);
            return [404, { error: 'Пользователь не найден.' }];
        }
    }
    else { // register
        if (user) {
            await dbRun(db, 'DELETE FROM telegram_auth WHERE code = ?', search.code);
            return [400, { error: 'Такой пользователь уже существует.' }];
        }
    }

    await dbRun(db, 'UPDATE telegram_auth SET telegram = ? WHERE code = ?', search.id, search.code);
    return [200, {}];
}