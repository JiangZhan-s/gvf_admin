import {Service} from "../service/service";


export function shareGenerateApi(data, folderId) {
    return Service.post("/api/share_generate", data, {
        headers: {
            "Content-Type": "application/json",
            "folder_id": folderId,
        },
    })
}

export function queryShareCodeByIdApi(folderId) {
    return Service.get("/api/query_share_by_id", {
        headers: {
            "Content-Type": "application/json",
            "folder_id": folderId,
        },
    })
}