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
      <div class="tabs"></div>
      <main>
        <div class="gvf_view">
          <router-view v-slot="{Component}">
            <transition name="fade">
              <component :is="Component"></component>
            </transition>
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

    .tabs {
      height: 30px;
      border-color: var(--order);
      border-style: solid;
      border-width: 1px 0 1px 0;
      background-color: var(--card_bg);
    }

    main {
      padding: 20px;
    }
  }
}
</style>

<style>

.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active {
  transform: translateX(-30px);
  opacity: 0;
}

.fade-enter-to {
  transform: translateX(0px);
  opacity: 1;
}

.fade-leave-active .fade-enter-active {
  transition: all 0.3s ease-out;
}

</style>