import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/login.vue")
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("../views/admin/admin.vue"),
            children: [
                {
                    path: "",
                    name: "admin_index",
                    redirect: "/admin/home"
                },
                {
                    path: "home",
                    name: "home",
                    component: () => import("../views/admin/home/home.vue")
                },
                {
                    path: "upload",
                    name: "upload",
                    component: () => import("../views/admin/file_mgr/file_upload.vue"),
                },
                {
                    path: "files",
                    name: "files",
                    component: () => import("../views/admin/file_mgr/file_list.vue"),
                },
                {
                    path: "file_text",
                    name: "file_text",
                    component: () => import("../views/admin/file_mgr/file_classify/file_text.vue")
                },
                {
                    path: "file_movie",
                    name: "file_movie",
                    component: () => import("../views/admin/file_mgr/file_classify/file_movie.vue")
                },
                {
                    path: "file_picture",
                    name: "file_picture",
                    component: () => import("../views/admin/file_mgr/file_classify/file_picture.vue")
                },
                {
                    path: "shares",
                    name: "shares",
                    component: () => import("../views/admin/file_mgr/share_list.vue")
                },
                {
                    path: "share_file",
                    name: "share_file",
                    component: () => import("../views/admin/file_mgr/share_file.vue")
                },
                {
                    path: "folder_file",
                    name: "folder_file",
                    component: () => import("../views/admin/file_mgr/file_folder.vue")
                },
                {
                    path: "users",
                    name: "users",
                    component: () => import("../views/admin/user/user.vue")
                },
                {
                    path: "roles",
                    name: "roles",
                    component: () => import("../views/admin/user/role.vue")
                },
                {
                    path: "login_data",
                    name: "login_data",
                    component: () => import("../views/admin/user/login_data.vue")
                },
                {
                    path: "fabric",
                    name: "fabric",
                    component: () => import("../views/admin/fabric/fabric.vue")
                }
            ]
        },
    ]
})


export default router

