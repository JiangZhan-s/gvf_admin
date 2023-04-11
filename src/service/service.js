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
        // 判断返回的数据类型是否为 BLOB
        if (response.data instanceof Blob) {
            return response;  // 不拦截 BLOB 类型数据
        } else {
            return response.data;  // 拦截其他类型数据
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);