export default function Link(props, children) {
    const onClick = props.onClick;
    if (onClick) props.onClick = function(e) {
        e.preventDefault();
        if (link.href) onClick(link.href);
    };
    const link = <a {...props}>{children}</a>;
    return link;
}
