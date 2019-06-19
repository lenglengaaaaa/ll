<template>
    <div class="wrap">
        <div v-if="device==='mobile'&&!isCollapse" class="drawer-bg" @click="handleClickOutside" />
        <div class="Sidebar_container" :style="{left:device==='mobile'&&!isCollapse?'':'-54px'}">
            <div class="app_title">
                <p v-if="!isCollapse">新魔节测试</p>
                <i v-else class="el-icon-info" title="新魔节测试"></i>
            </div>
            <div :class="{foldSidebar: isCollapse}">
                <el-menu 
                    :default-active="activeIndex"
                    :unique-opened="false"
                    class="side-menu-demo" 
                    text-color="#fff"
                    active-text-color="#fff"
                    router
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    @select='handleClickOutside'
                >   
                    <el-menu-item v-for="item in routes" :key="item.path" :index="item.name" :route="{name:item.name}">
                        <i :class="item.meta.icon"></i>
                        <span slot="title">{{ item.meta.title }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: '',
            }
        },
        watch: {
            $route(to,from){
                this.activeIndex = to.name;
            },
        },
        computed: {
            routes() {
                const routes = this.$router.options.routes ;
                const index = routes.findIndex((item)=>item.path ==='/application');
                const result = routes[index].children[1].children;
                return result
            },
            device() {
                return this.$store.state.app.device
            },
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            },
        },
        mounted () {
            this.activeIndex = this.$route.name;
        },
        methods: {
            handleClickOutside() {
                if(this.device!=='mobile')return;
                this.$store.dispatch('app/closeSideBar')
            }
        },
    }
</script>

<style lang="scss">
    @import '@/styles/sidebar.scss';
</style>