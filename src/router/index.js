import {createRouter, createWebHistory} from 'vue-router'
import {reactive, watch} from "vue";

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
                    component: () => import("../views/admin/share_file.vue")
                }
            ]
        },
    ]
})


export default router

