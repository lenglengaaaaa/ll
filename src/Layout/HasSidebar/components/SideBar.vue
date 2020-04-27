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
                        <template v-for="item in routes" >
                            <el-menu-item 
                                :key="item.path" 
                                :index="item.path" 
                                :route="{name:item.name}"
                                :disabled="item.hidden"
                                v-if="!item.group"
                            >   
                                <svg-icon 
                                    :iconClass="item.meta.icon" 
                                    className="icon"
                                />
                                <span slot="title">{{ item.meta.title }}</span>
                            </el-menu-item>
                            <el-submenu :index="item.path"  :key="item.path" v-else>
                                <template slot="title">
                                    <svg-icon 
                                        :iconClass="item.path" 
                                        className="icon"
                                    />
                                    <span slot="title">{{ item.title }}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item 
                                        v-for="k in item.group"
                                        :key="k.path" 
                                        :index="k.path" 
                                        :route="{name:k.name}"
                                        :disabled="k.hidden"
                                    >   
                                        <svg-icon 
                                            :iconClass="k.meta.icon" 
                                            className="icon"
                                        />
                                        <span slot="title">{{ k.meta.title }}</span>
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </template>
                        
                        
                </el-menu>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

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
            ...mapState('user',[
                'permissionIds',
            ]),
            routes() {
                const routes = this.$router.options.routes ;
                const path = this.$route.path.split('/')[1]
                this.path = path;
                const index = routes.findIndex((item)=>item.path ===`/${path}`);
                const result = routes[index].children[path=="project"?1:0].children;

                //权限设置
                const menu = result.map(item=>{
                    item.hidden = !this.permissionIds.includes(item.id);
                    return item;
                })
                if( path === 'project'){
                    //6.7.8 为低压资产
                    //9.10 为电缆沟资产
                    let lowTension={ path:'lowTension', title:'低压资产', group:[] };
                    let cableChute={ path:'cableChute', title:'电缆沟资产', group:[] };
                    const filtered = menu.reduce((pre, cur, index, arr)=>{
                        if(cur.id == 6 || cur.id == 7 || cur.id == 8 ){
                            if(pre.some(item=>item.path==='lowTension')){
                                for(let k of pre){
                                    if(k.path === 'lowTension') {
                                        k.group.push(cur);
                                        break;
                                    };
                                }
                                return pre;
                            }else{
                                lowTension.group.push(cur);
                                return [...pre, lowTension]
                            }
                        }
                        if(cur.id == 9 || cur.id == 10){
                            if(pre.some(item=>item.path==='cableChute')){
                                for(let k of pre){
                                    if(k.path === 'cableChute') {
                                        k.group.push(cur);
                                        break;
                                    };
                                }
                                return pre;
                            }else{
                                cableChute.group.push(cur);
                                return [...pre, cableChute]
                            }
                        }
                        return [...pre,cur]
                    },[])
                    return filtered;
                }
                return menu;
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