import Link from '../link.jsx';
import styles from './styles.scss';

export default function Event(event, goPage) {
    const eventDate = new Date(event.time * 1000).toLocaleDateString('ru', {
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <Link class={styles.event} href={`/event/?id=${event.id}`} onClick={goPage}>
            <div class={styles.title}>{event.title}</div>
            <div class={styles.info}>{eventDate}, {event.duration / 60} минут, {event.location}</div>
            <div class={styles.description}>{event.description}</div>
        </Link>
    );
}