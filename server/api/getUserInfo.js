import { dbGet } from '../db.js';

export async function get(db, { userId }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];

    const [user] = await dbGet(db, 'SELECT * FROM users WHERE id = ?', userId);
    return [200, {
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        secondName: user.second_name,
        thirdName: user.third_name,
        country: user.country,
        city: user.city,
        linkedTelegram: user.telegram !== null,
        telegramNotifications: user.telegram_notifications
    }];
}