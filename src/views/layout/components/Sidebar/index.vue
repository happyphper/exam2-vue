<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'roles'
    ]),
    routes() {
      let routes = Object.assign({}, this.$router.options.routes)
      const isAdmin = this.roles.some(item => {
        return item.name === 'admin' || item.name === 'superAdmin'
      })
      routes = Object.values(routes)
      if (!isAdmin) {
        routes.find(item => item.path === '/teachers').hidden = true
      }
      return routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
