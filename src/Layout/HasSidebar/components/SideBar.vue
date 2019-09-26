<template>
    <div class="wrap">
        <div v-if="device==='mobile'&&!isCollapse" class="drawer-bg" @click="handleClickOutside" />
        <div class="Sidebar_container" :style="{left:device==='mobile'&&!isCollapse?'':'-54px'}">
            <div class="app_title">
                <p v-if="!isCollapse">{{projectName}}</p>
                <i v-else class="el-icon-info" :title="projectName"></i>
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
                    <el-menu-item v-for="item in routes" :key="item.path" :index="item.path" :route="{name:item.name}">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.meta.icon"></use>
                        </svg>
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
                path:'',
                activeIndex: ''
            }
        },
        mounted () {
            const path = this.$route.path.split('/')[2]
            this.activeIndex = path;
        },
        watch: {
            $route(to,from){
                const path = to.path.split('/')[2]
                this.activeIndex = path;
            },
        },
        computed: {
            routes() {
                const routes = this.$router.options.routes ;
                const path = this.$route.path.split('/')[1]
                this.path=path;
                const index = routes.findIndex((item)=>item.path ===`/${path}`);
                const result = routes[index].children[path=="project"?1:0].children;
                return result
            },
            device() {
                return this.$store.state.app.device
            },
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            },
            projectName(){
                const path = this.$route.path.split('/')[1];
                if(path==='senior'){
                    return '高级管理';
                } else if(path==="account"){
                    return '账号管理'
                }else{
                    const project = sessionStorage.getItem('project')&&JSON.parse(sessionStorage.getItem('project'));
                    return  project&&project.name
                }
            }
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
    @import '@styles/sidebar.scss';
</style>