export function createDialog(content, buttons) {
    return (
        <div class="dialog">
            <div class="dialog-content">{content}</div>
            <div class="dialog-buttons">{Object.entries(buttons).map(([k, v]) => <button onClick={v}>{k}</button>)}</div>
        </div>
    );
}