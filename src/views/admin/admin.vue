<template>
  <div class="gvf_admin">
    <GVFAside></GVFAside>
    <div class="main">
      <header>
        <div class="left">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item><a href="#">个人中心</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="#">用户列表</a></a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="right">
          <div class="icon_actions">
            <i class="fa fa-home"></i>
            <GVFTheme></GVFTheme>
            <GVFFullScreen></GVFFullScreen>
          </div>
          <GVFUserInfo></GVFUserInfo>
        </div>
      </header>
      <div class="tabs"></div>
      <main></main>
    </div>
  </div>
</template>


<script setup>
import GVFTheme from "../../components/gvf_theme.vue"
import GVFAside from "../../components/admin/gvf_aside.vue"
import GVFFullScreen from "../../components/gvf_full_screen.vue"
import GVFUserInfo from "../../components/gvf_user_info.vue"

</script>

<style lang="scss">
.gvf_admin {
  width: 100%;
  display: flex;

  .main {
    width: calc(100% - 240px);

    header {
      height: 60px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .right {
        display: flex;
        align-items: center;
      }

      .icon_actions {
        margin-right: 20px;

        i {
          margin-left: 10px;
          cursor: pointer;
          font-size: 16px;
          color: var(--text);
        }

        i:hover {
          color: var(--active)
        }
      }

      .avatar {
      }

      .drop_menu {
        margin-left: 10px;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .tabs {
      height: 30px;
      border: 1px solid var(--order);
    }

    main {
      background-color: var(--bg);
      height: calc(100vh - 90px);
    }
  }
}
</style>