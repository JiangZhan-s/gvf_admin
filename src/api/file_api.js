import {Service} from "../service/service";
import axios from "axios";

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

export function fileDownloadApi(fileId) {
    return Service.get("/api/download", {
        responseType: 'blob',
        headers: {
            "Content-Type": "application/octet-stream",
            "file_id": fileId,
        }
    })
}