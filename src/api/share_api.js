import {Service} from "../service/service";


export function shareGenerateApi(data, fileId) {
    return Service.post("/api/share_generate", data, {
        headers: {
            "Content-Type": "application/json",
            "file_id": fileId,
        },
    })
}

export function queryShareCodeByIdApi(fileId) {
    return Service.get("/api/query_share_by_id", {
        headers: {
            "Content-Type": "application/json",
            "file_id": fileId,
        },
    })
}

export function getShareInfoByHashApi(hash) {
    return Service.get("/api/get_share_file_id_by_hash", {
        headers: {
            "Content-Type": "application/json",
            "share_hash": hash,
        },
    })
}

export function getShareFileInfoByCodeApi(code, fileId) {
    return Service.get("/api/get_share_file_info_by_code", {
        headers: {
            "Content-Type": "application/json",
            "hash_code": code,
            "file_id": fileId
        },
    })
}

export function getCodeByIdApi(fileId) {
    return Service.get("/api/get_code_by_id", {
        headers: {
            "Content-Type": "application/json",
            "file_id": fileId
        },
    })
}