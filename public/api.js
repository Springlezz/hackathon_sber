export function getApi(name, data = {}) {
    return fetch(`/api/${name}?` + Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')).then(r => r.json());
}
export function postApi(name, data = {}) {
    return fetch('/api/' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json());
}