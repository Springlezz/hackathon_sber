import { $addClasses, $append, $E, $remove, $style, $T } from '../scripts/dom.js';
export function createDialog(content, buttons) {
    return $E('div', { id: 'dialog' }, [
        $E('div', { id: 'dialog-content' }, content),
        $E('div', { id: 'dialog-buttons' }, Object.entries(buttons).map(([k, v]) => $E('button', { onclick: v }, $T(k))))
    ]);
}