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