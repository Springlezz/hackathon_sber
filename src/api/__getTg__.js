import { dbGet } from '../db.js';
import { API_KEY } from '../consts.js';

export async function get(db, { search }) {
    const check = checkProps(['key', 'id'], search);
    if (check) return [400, { error: check }];

    if (search.key !== API_KEY) return [401, { error: 'Неверный ключ API.' }];

    const [user] = await dbGet(db, 'SELECT email, role, city, first_name, second_name, third_name FROM users WHERE telegram = ?', id);
    if (!user) return [404, { error: 'Пользователь не найден.' }];
    return [200, {
        email: user.email,
        role: user.role,
        city: user.city,
        firstName: user.first_name,
        secondName: user.second_name,
        thirdName: user.third_name
    }];
}