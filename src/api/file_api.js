import {Service} from "../service/service";

export function fileUploadApi(data) {
    return Service.post("/api/upload", data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "id": 1,
        }
    })
}

export function fileListApi(params) {
    return Service.get("/api/query_all", {params})
}