import axios from "axios";
import {message} from "ant-design-vue";

export const Service = axios.create({
    timeout: 70000,
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
        if (error.response && error.response.status === 550) {
            // 处理 500 错误响应
            // 在此处可以根据具体的情况采取不同的处理方式
            message.error("链上连下数据协同验证不统一，下载请求被拒绝")
        }
        return Promise.reject(error);
    }
);