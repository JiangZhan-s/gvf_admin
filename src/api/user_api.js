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

export function getNicknameById(userId) {
    return Service.get("/api/get_nickname_by_id", {
        headers: {
            "Content-Type": "application/json",
            "user_id": userId
        }
    })
}