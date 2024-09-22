import Header from './components/header/index.jsx';
import styles from './index.scss';
import { getApi } from './lib/api.js';
import { $T, $append, $remove } from './lib/dom.js';
import CreateEvent from './pages/create-event/index.jsx';
import Error404 from './pages/error404/index.jsx';
import Event from './pages/event/index.jsx';
import LinkTelegram from './pages/link-telegram/index.jsx';
import Login from './pages/login/index.jsx';
import LoginTelegram from './pages/loginTelegram/index.jsx';
import Main from './pages/main/index.jsx';
import Register from './pages/register/index.jsx';
import RegisterTelegram from './pages/registerTelegram/index.jsx';
import Settings from './pages/settings/index.jsx';

const routes = {
    '/': Main,
    '/login/': Login,
    '/register/': Register,
    '/login/telegram/': LoginTelegram,
    '/register/telegram/': RegisterTelegram,
    '/settings/': Settings,
    '/link-telegram/': LinkTelegram,
    '/create-event/': CreateEvent,
    '/event/': Event
};

const [header, showMenu, authShowButtons] = Header(goPage);
$append(document.body, header);

getApi('getUserInfo').then(function(info) {
    if (info.error) authShowButtons();
    else showMenu(info);
});

let isAuthorized = false;
function authorized(auth) {
    if (typeof auth === 'boolean') {
        isAuthorized = auth;
        if (auth) getApi('getUserInfo').then(showMenu);
        else authShowButtons();
    }
    return isAuthorized;
}

function goPage(path) {
    history.pushState(null, null, path);
    loadRoutes();
}

let lastMain;
function loadRoutes() {
    if (lastMain) $remove(lastMain);

    const titleText = $T();
    const main = <div class={styles.main}>
        <h1 class={styles.title}>{titleText}</h1>
    </div>;

    lastMain = main;
    $append(document.body, lastMain);

    function setTitle(newTitle) {
        titleText.textContent = newTitle || '';
        document.title = (newTitle ? newTitle + ' — ' : '') + 'Hackathon App';
    }
    function mainAppend(children) {
        $append(main, children);
    }
    function headerAppend(children) {
        $append(header, children);
    }
    function setBack(path) {
        if (path) backBtn.href = path;
        else backBtn.removeAttribute('href');
    }

    let page = Error404;
    if (routes[location.pathname]) {
        page = routes[location.pathname];
    }

    page({
        setTitle, setBack, mainAppend, headerAppend,
        authorized, goPage
    });
}

addEventListener('popstate', loadRoutes);
loadRoutes();