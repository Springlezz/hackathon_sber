function promisifyDb(db, func, sql, params) {
    return new Promise(function(resolve, reject) {
        db[func](sql, params, function(err, result) {
            if (err) reject(err);
            else resolve([result, { ...this }]);
        });
    });
}

export function dbGet(db, sql, ...params) {
    return promisifyDb(db, 'get', sql, params);
}
export function dbAll(db, sql, ...params) {
    return promisifyDb(db, 'all', sql, params);
}
export function dbRun(db, sql, ...params) {
    return promisifyDb(db, 'run', sql, params);
}