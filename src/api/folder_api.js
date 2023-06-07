import {Service} from "../service/service";

export function folderRootFindApi() {
    return Service.get("/api/folder_root_find")
}

export function folderAddApi(folderInfo) {
    return Service.post("/api/add_file_folder", folderInfo, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function parentIdFindApi(folderId) {
    return Service.get("/api/query_parent_folder_id", {
        headers: {
            "Content-Type": "application/json",
            "folder_id": folderId,
        },
    })
}

export function folderUploadApi(folderInfo) {
    return Service.post("/api/upload", data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "parent_folder_id": folderInfo.parentFolderId,
            "folder_name": folderInfo.folderName
        },
    })
}


export function folderDeleteApi(folderId) {
    return Service.post("/api/folder_delete", "", {
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_id": folderId,
        },
    })
}

export function folderCountApi(folderId) {
    return Service.get("/api/query_folder_count", {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}