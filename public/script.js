function getApi(name, data = {}) {
    return fetch(`/api/${name}?` + Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')).then(r => r.json());
}
function postApi(name, data = {}) {
    return fetch('/api/' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json());
}


function authShowUser(info) {
    const menu = $('<div id="menu">').append(
        $('<button>Профиль</button>').click(() => location.href = '/profile/'),
        $('<button>Мои события</button>'),
        $('<button>Настройки</button>'),
        $('<button>Выход</button>').click(function() {
            getApi('logout');
            authShowButtons();
        })
    );
    $('#auth').empty().append(
        $('<button>').text(`${info.firstName} ${info.secondName}`).click(() => menu.toggleClass('show')),
        menu
    );
}
function authShowButtons() {
    $('#auth').empty().append(
        $('<button>Вход</button>').click(() => location.href = '/login/'),
        $('<button>Регистрация</button>').click(() => location.href = '/register/')
    );
}

getApi('getUserInfo').then(function(info) {
    if (info.error) authShowButtons();
    else authShowUser(info);
});