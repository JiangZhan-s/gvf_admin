import {Service} from "../service/service";

export function folderRootFindApi() {
    return Service.get("/api/folder_root_find")
}

export function folderAddApi(parentFolderId, folderName) {
    return Service.post("/api/add_file_folder", "", {
        headers: {
            "Content-Type": "application/json",
            "parent_folder_id": parentFolderId,
            "folder_name": folderName,
        },
    })
}