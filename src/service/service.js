import axios from "axios";

export const Service = axios.create({
    timeout: 7000,
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    }
})

// 添加请求拦截器
Service.interceptors.request.use(request => {
    // 获取本地存储的token
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    // 在header中添加Authorization字段
    if (token) {
        request.headers['token'] = token
    }
    return request
})

Service.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);