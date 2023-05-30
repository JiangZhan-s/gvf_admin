export function parseToken(token) {
    // let payload = token.split(".")[1]
    // return JSON.parse(decodeURIComponent(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))))
    let payload = token.split(".")[1];
    let base64Url = payload.replace(/-/g, "+").replace(/_/g, "/");
    let base64 = base64Url + "===".substring(0, (4 - base64Url.length % 4) % 4);
    let decodedPayload = window.atob(base64);
    let utf8Decoder = new TextDecoder("utf-8");
    let parsedPayload = utf8Decoder.decode(new Uint8Array([...decodedPayload].map((c) => c.charCodeAt(0))));

    return JSON.parse(parsedPayload);
}