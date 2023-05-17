import {Service} from "../service/service";
import axios from "axios";

export function fileUploadApi(data, folderId, config) {
    return Service.post("/api/upload", data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_id": folderId,
        },
        ...config
    })
}

export function fileBatchUploadApi(data, folderId, config) {
    return Service.post("/api/upload_multi", data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_id": folderId,
        },
        ...config
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

export function fileDetailApi() {
    return Service.get("/api/query_detail_use", {
        headers: {
            "Content-Type": "application/json",
        }
    })
}

