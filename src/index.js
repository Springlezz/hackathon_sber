import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { createServer } from 'http';
import sqlite3 from 'sqlite3';
import { gzip } from 'zlib';
import createTables from './createDB.js';
import { dbRun } from './db.js';
import { getSession } from './session.js';
import initTelegramBot from './telegramBot.js';

const db = new sqlite3.Database('database.db');
await createTables(db);
// debug
dbRun(db, 'INSERT INTO tags (name, color) VALUES (?, ?)', 'Программирование', '0,17,229');
dbRun(db, 'INSERT INTO tags (name, color) VALUES (?, ?)', 'Семья', '255,6,222');
dbRun(db, 'INSERT INTO tags (name, color) VALUES (?, ?)', 'Окружение', '0,228,36');
dbRun(db, 'INSERT INTO events (creator, time, duration, title, description, location, accepted, confirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 0, 1726829456, 2, 'Хакатон - открытие', '', 'online', 1, 1);
dbRun(db, 'INSERT INTO events (creator, time, duration, title, description, location, accepted, confirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 0, 1726829456, 2, 'Хакатон - закрытие', '', 'online', 1, 1);

initTelegramBot(db);

const types = {
    txt: 'text/plain; charset=utf-8',
    html: 'text/html; charset=utf-8',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
    ttf: 'font/ttf'
};

const pages = {
    '/': 'main',
    '/login/': 'login',
    '/register/': 'register',
    '/create-event/': 'create-event'
};

function getBody(req) {
    return new Promise(function(resolve) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
    });
}
function parseBody(body) {
    return Object.fromEntries(body.split('&').map(a => a.split('=').map(decodeURIComponent)));
}
function getToken(req) {
    if (req.headers.cookie?.includes('sessionToken=')) {
        return req.headers.cookie.match(/sessionToken=([^;]+)/)[1];
    }
    return null;
}
function serializeCookies(cookies) {
    return cookies ? Object.entries(cookies).map(([k, v]) => `${k}=${v}; Path=/`) : [];
}
function getPage(pagePath) {
    return Promise.all([
        readFile('./public/index.html', 'utf-8'),
        readFile(`./pages/${pagePath}.html`, 'utf-8'),
        existsSync(`./public/pageScripts/${pagePath}.js`)
    ]).then(function([main, page, hasScript]) {
        return main.replace('{{content}}', page).replace('{{head}}', hasScript ? `<script src="/pageScripts/${pagePath}.js" type="module" defer></script>` : '');
    });
}

createServer(function(req, res) {
    function send(code, headers, data) {
        if (req.headers['accept-encoding']?.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.writeHead(code, headers);
            gzip(data, (err, data) => res.end(data));
        }
        else res.writeHead(code, headers).end(data);
    }

    const url = new URL(req.url, 'http://localhost');
    let path = url.pathname;
    const token = getToken(req);
    if (path.startsWith('/api/')) {
        const search = Object.fromEntries(url.search.slice(1).split('&').map(a => a.split('=').map(b => decodeURIComponent(b))));
        import(`./api/${path.slice(5)}.js`).then(async function(module) {
            const method = req.method.toLowerCase();
            if (method in module) {
                const body = await getBody(req);
                let parsedBody = undefined;
                if (req.headers['content-type']?.includes('application/json')) {
                    try {
                        parsedBody = JSON.parse(body);
                    }
                    catch (e) {
                        return send(400, { 'Content-Type': 'application/json' }, JSON.stringify({ error: 'Тело запроса не является JSON.' }));
                    }
                }

                const [code, resp, cookies] = await module[method](db, {
                    userId: await getSession(db, token),
                    search, token,
                    body: parsedBody
                });
                send(code, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': serializeCookies(cookies)
                }, JSON.stringify(resp));
            }
            else res.writeHead(405).end();
        }, () => res.writeHead(404).end());
    }
    else {
        if (req.method === 'POST') {
            switch (path) {
                case '/login/':
                    Promise.all([
                        import('./api/login.js'),
                        getBody(req), getSession(db, token)
                    ]).then(([login, body, userId]) => login.post(db, { userId, body: parseBody(body) })).then(function([code, resp, cookies]) {
                        if (code === 200) {
                            res.writeHead(302, { Location: '/', 'Set-Cookie': serializeCookies(cookies) }).end();
                        }
                        else {
                            getPage('login').then(function(page) {
                                send(200, { 'Set-Cookie': serializeCookies(cookies) }, page.replace('<form', `<div class="error">${resp.error}</div><form`));
                            });
                        }
                    });
                    break;
                case '/register/':
                    Promise.all([
                        import('./api/register.js'),
                        getBody(req), getSession(db, token)
                    ]).then(([register, body, userId]) => register.post(db, { userId, body: parseBody(body) })).then(function([code, resp, cookies]) {
                        if (code === 200) {
                            res.writeHead(302, { Location: '/', 'Set-Cookie': serializeCookies(cookies) }).end();
                        }
                        else {
                            getPage('login').then(function(page) {
                                send(200, { 'Set-Cookie': serializeCookies(cookies) }, page.replace('<form', `<div class="error">${resp.error}</div><form`));
                            });
                        }
                    });
                    break;
                default:
                    res.writeHead(405).end();
            }
            return;
        }
        else if (req.method !== 'GET') {
            res.writeHead(405).end();
            return;
        }

        if (path.includes('.')) {
            readFile('./public' + path).then(function(data) {
                send(200, { 'Content-Type': types[path.split('.').pop()] || types.txt }, data);
            }, () => res.writeHead(404).end());
        }
        else {
            const pagePath = pages[path];
            if (pagePath) {
                getPage(pagePath).then(page => send(200, { 'Content-Type': types.html }, page));
            }
            else res.writeHead(404).end();
        }
    }
}).listen(80);

setInterval(function() {
    dbRun(db, 'DELETE FROM sessions WHERE expires <= ?', Date.now());
    dbRun(db, 'DELETE FROM telegram_auth WHERE expires <= ?', Date.now());
}, 60_000);