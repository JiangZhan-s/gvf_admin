export function parseToken(token) {
    let payload = token.split(".")[1]
    return JSON.parse(decodeURIComponent(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))))
}