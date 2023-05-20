import {Service} from "../service/service";
import axios from "axios";

export function emailLoginApi(data) {
    return Service.post("/api/email_login", data, {
        headers: {},
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

export function getUserIPApi() {
    const api = axios.create({
        baseURL: '/ip', // 设置基础URL，对应你在配置文件中的转发规则
    });

    return api.get('/')
        .then(response => response.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
}

export function getCityFromIP(ip) {
    return axios.get(`/city/${ip}`)
        .then(response => {
            const data = response.data;
            if (data.status === 'success') {
                const city = data.city;
                const regionName = data.regionName
                return regionName + " " + city;
            } else {
                throw new Error('Failed to get city from IP');
            }
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
