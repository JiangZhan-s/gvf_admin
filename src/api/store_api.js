import {Service} from "../service/service";

export function queryStoreByUserIdApi() {
    return Service.get("/api/query_store_by_user_id", {
        headers: {
            "Content-Type": "application/json",
        },
    })
}
