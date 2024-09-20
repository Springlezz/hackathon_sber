export function isNoNegInt(num) {
    return /^[0-9]+$/.test(num);
}

export function isPosInt(num) {
    return /^[1-9][0-9]*$/.test(num);
}