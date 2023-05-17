import {Service} from "../service/service";

export function baseListApi(url, params, headers) {
    return Service.get(url, {
        params: params,
        headers: headers // 设置请求头信息
    });
}


