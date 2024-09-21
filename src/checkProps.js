export default function checkProps(props, obj) {
    for (const prop of props) {
        if (!obj || !(prop in obj)) return `Требуется свойство "${prop}"`;
    }
    for (const prop in obj) {
        if (!props.includes(prop)) return `Неизвестное свойство "${prop}"`;
    }
}