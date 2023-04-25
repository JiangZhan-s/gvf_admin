import {defineStore} from 'pinia'
import {message} from "ant-design-vue";

export const useStore = defineStore('gvf', {
    state: () => {
        return {
            theme: "true",
            userInfo: {
                nick_name: '',
                role: 0,
                user_id: 0,
                exp: 0
            },
            userFolderRoot: -1,
        }
    },
    actions: {
        //切换主题
        setTheme() {
            this.theme = !this.theme
            if (this.theme) {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light")
            } else {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
            }
        },
        //加载主题
        loadTheme() {
            const theme = localStorage.getItem("theme")
            if (theme === "dark") {
                this.theme = false
                document.documentElement.classList.add("dark")
                return
            }
            this.theme = true
        },
        //修改userInfo
        setUserInfo(info) {
            this.$patch({
                userInfo: info
            })
            //持久化
            localStorage.setItem("userInfo", JSON.stringify(info))
        },
        loadUserInfo() {
            let info = localStorage.getItem("userInfo")
            if (info === null) {
                return
            }
            //先json解析
            let userInfo = JSON.parse(info)
            //判断时间是否失效
            let exp = userInfo.exp
            let nowTime = new Date().getTime()
            if (((exp * 1000) - nowTime) < 0) {
                //过期了
                message.warn("当前登录已失效")
                return;
            }
            this.setUserInfo(userInfo)
        },
        //设置用户文件夹根目录
        setFolderRoot(id) {
            this.$patch({
                folderRootId: id
            })
            //持久化
            localStorage.setItem("folderRootId", id)
        },
        loadFolderRoot() {
            let folderRootId = localStorage.getItem("folderRootId")
            if (folderRootId === null) {
                return
            }
            this.setFolderRoot(folderRootId)
        },
    }
})
