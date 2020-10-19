<template>
  <el-breadcrumb separator="/">
      <el-breadcrumb-item 
          v-for="item in levelList" 
          :key="item.name" 
          :to="item.path"
      >
          {{item.meta.title}}
      </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);

      // temporay 2020/10/19
      // console.log(matched);
      // matched[1].meta.title="电缆沟001";

      const first = matched[0]
      // matched = [{ path: '/application', meta: { title: '应用管理' }}].concat(matched)
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
