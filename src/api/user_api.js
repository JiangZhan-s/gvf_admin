import {Service} from "../service/service";

export function emailLoginApi(data) {
    return Service.post("/api/email_login", data, {
        headers: {}
    })
}

export function logoutApi() {
    return Service.post("/api/logout", "", {
        headers: {}
    })
}