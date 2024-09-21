import { createHash } from 'crypto';

export function isNoNegInt(num) {
    return /^[0-9]+$/.test(num);
}

export function isPosInt(num) {
    return /^[1-9][0-9]*$/.test(num);
}

export function hashPassword(password) {
    return createHash('sha256').update(password).digest('hex');
}