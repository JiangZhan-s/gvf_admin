<template>
  <div class="gvf_admin">
    <GVFAside></GVFAside>
    <div class="main">
      <header>
        <div class="left">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <!--            <template v-for="item in items" :key="item">-->
            <!--              <a-breadcrumb-item><a :href="valueToLabel[item]?.href">{{ valueToLabel[item]?.label }}</a></a-breadcrumb-item>-->
            <!--            </template>-->
          </a-breadcrumb>
        </div>
        <div class="right">
          <div class="icon_actions">
            <i class="fa fa-home"></i>
            <GVFTheme></GVFTheme>
            <GVFFullScreen></GVFFullScreen>
          </div>
          <GVFUserInfo :is-avatar="true"></GVFUserInfo>
        </div>
      </header>
      <GVFTabs></GVFTabs>
      <main>
        <div class="gvf_view">
          <router-view v-slot="{ Component }">
            <component :is="Component"></component>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>


<script setup>
import GVFTheme from "../../components/gvf_theme.vue"
import GVFAside from "../../components/admin/gvf_aside.vue"
import GVFFullScreen from "../../components/gvf_full_screen.vue"
import GVFUserInfo from "../../components/gvf_user_info.vue"
import GVFTabs from "../../components/admin/gvf_tabs.vue"
</script>

<style lang="scss">
.gvf_admin {
  width: 100%;
  display: flex;

  .main {
    width: calc(100% - 240px);
    height: 100vh;
    overflow-y: auto;
    background-color: var(--bg);

    header {
      height: 60px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--card_bg);

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

    main {
      padding: 2px;
    }
  }
}
</style>
