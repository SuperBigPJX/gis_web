import Cookies from "js-cookie";

export function setCookie(name, value, expires) {
    if (expires === undefined || expires === null) {
        Cookies.set(name, JSON.stringify(value));
    } else {
        Cookies.set(name, JSON.stringify(value), {expires: expires});
    }
}

export function getCookie(name) {
    if (Cookies.get(name) === undefined || Cookies.get(name) === null) {
        return null;
    }
    return JSON.parse(Cookies.get(name));
}

export function removeCookie(name) {
    Cookies.remove(name);
    Cookies.set(name, null, -1);
}

