import {Service} from "../service/service";

export function baseListApi(url, params) {
    return Service.get(url, {params})
}