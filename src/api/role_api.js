import {Service} from "../service/service";


export function addRoleApi(data) {
    return Service.post("/api/add_role", data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function deleteRoleByIdApi(data) {
    return Service.post("/api/delete_role_by_id", data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function queryPermissionAllApi() {
    return Service.get("/api/query_permission_all", {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function updateRolePermission(data) {
    return Service.post("/api/update_role_permission", data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function fetchRolePermissionIDsApi(roleId) {
    return Service.get('/api/query_permissions_by_role_id', {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {roleId: roleId},
    });
}