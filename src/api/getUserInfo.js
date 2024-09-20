import { dbGet } from '../db.js';

export async function get(db, { userId }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];

    const [user] = await dbGet(db, 'SELECT email, role, city, first_name, second_name, third_name FROM users WHERE id = ?', userId);
    return [200, {
        email: user.email,
        role: user.role,
        city: user.city,
        firstName: user.first_name,
        secondName: user.second_name,
        thirdName: user.third_name
    }];
}