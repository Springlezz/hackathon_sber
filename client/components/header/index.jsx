import { getApi } from '../../lib/api.js';
import { $append, $clear, $remove, $toggleClasses } from '../../lib/dom.js';
import Link from '../link.jsx';
import styles from './styles.scss';

export default function Header(goPage) {
    const $auth = <div class={styles.auth} />;

    const createEvent = <Link class={styles.button} href="/create-event/" onClick={goPage}>Создать событие</Link>;
    const headerMenu = <div class={styles.headerMenu}><Link class={styles.logo} href="/" onClick={goPage} /></div>;

    function showMenu(info) {
        $clear($auth);
        const menu = (
            <div class={styles.menu} onClick={() => $toggleClasses(menu, styles.show)}>
                <Link class={styles.button} href="/profile/" onClick={goPage}>Профиль</Link>
                <Link class={styles.button} href="/my-events/" onClick={goPage}>Мои события</Link>
                <Link class={styles.button} href="/settings/" onClick={goPage}>Настройки</Link>
                <button class={styles.button} onClick={function() {
                    getApi('logout');
                    authShowButtons();
                }}>Выход</button>
            </div>
        );
        $append(
            $auth,
            <button class={styles.button} onClick={() => $toggleClasses(menu, styles.show)}>{info.firstName} {info.secondName}</button>,
            menu
        );
        if (info.role > 0) $append(headerMenu, createEvent);
    }
    function authShowButtons() {
        $clear($auth);
        $auth.append(
            <Link class={styles.button} href="/login/" onClick={goPage}>Вход</Link>,
            <Link class={styles.button} href="/register/" onClick={goPage}>Регистрация</Link>
        );
        $remove(createEvent);
    }

    return [
        <div class={styles.header}>{headerMenu}{$auth}</div>,
        showMenu, authShowButtons
    ];
}