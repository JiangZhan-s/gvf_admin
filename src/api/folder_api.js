import {Service} from "../service/service";

export function folderRootFindApi() {
    return Service.get("/api/folder_root_find")
}