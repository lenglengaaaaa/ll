<template>
    <div class="Navbar" ref="Navbar">
        <div class="container">
            <div class='title' >
                <!-- <img src="@images/logo.png" alt="logo" @click="skipHome"> -->
                <img :src="logoUrl" alt="logo" @click="skipPage('Home')">
            </div>
            <div class="menu" v-if='!phone'>
                <div class="left_menu">
                    <el-menu 
                        :default-active="activeIndex"
                        class="el-menu-demo" 
                        mode="horizontal" 
                        text-color="#fff"
                        router
                        @select="selectMenu"
                    >   
                        <el-menu-item 
                            v-for="item in navbar" 
                            :key="item.path" 
                            :index="item.path" 
                        >
                            {{ item.name }}
                        </el-menu-item>
                    </el-menu>
                </div>
                
                <div class="right_menu">
                    <!-- 全屏 -->
                    <i class="el-icon-full-screen" @click="full" title="全屏"/>
                    
                    <!-- 告警信息收集展示 -->
                    <!-- <Notice /> -->

                    <i class="el-icon-search" @click="flag = true" title="设备搜索"/>
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper">
                            <img :src="imagePath" class="user-avatar">
                            <span class="username" >{{username}}</span>
                            <i class="el-icon-caret-bottom" />
                        </div>
                        <el-dropdown-menu slot="dropdown" class="user-dropdown">
                            <!-- <el-dropdown-item>
                                <span style="display:block;" @click="skipPage('Project')">项目管理</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span style="display:block;" @click="skipPage('Senior')">高级管理</span>
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                                <span style="display:block;" @click="skipPage('Account')">账号管理</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span style="display:block;" @click="logout">退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="phone_list" v-else>
                <!-- <Notice />  -->
                <i class="el-icon-more" @click="moreClick"></i>
            </div>
        </div>
        <div class="list" ref="list" v-if="phone">
            <el-menu 
                :default-active="activeIndex"
                @select="closeList"
                router
            >   
                <el-menu-item v-for="item in navbar" :key="item.path" :index="item.path" :route="item.route" >
                    {{ item.name }}
                </el-menu-item>
                <el-menu-item @click="flag=true">搜索</el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <img src="@images/avatar.png" :style="{paddingRight:'5px'}"/>
                        <span>{{username}}</span>
                    </template>
                    <el-menu-item @click="skipPage('Account')" index="1-1">账号管理</el-menu-item>
                    <el-menu-item @click="logout" index="1-2">退出登录</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <GlobalSearch :visible="flag" :close="closeSearch"/>
    </div>
</template>

<script>
    import GlobalSearch from './GlobalSearch' 
    import avatar from '@images/default.jpg'
    import { judgeUserDetail, judgeEquipTypeMenu} from '@/utils/methods'
    import Notice from './notice'
    import { mapState } from 'vuex'

    export default {
        name:'Header',
        data() {
            return {
                activeIndex: '',
                flag:false,
                phone:false,
                fold:false,
                username:'',
                imagePath:require('@images/default.jpg'),
                codeStr:'',
                userClient:null,
                logoUrl:require('@images/logo.png')
            }
        },
        components: {
            GlobalSearch,
            Notice
        },
        created (){
            //这里进行权限配置,改变navbar

            //初始化数据
            this.initialize();
            //高亮
            this.hightlight(this.$route.path)
            //适配
            // this.resizehandle(this.$store.state.app.device);
        },
        destroyed () {
            this.userClient && this.userClient.end();
        },
        watch: {
            $route(to,from){
                this.hightlight(to.path);
            },
            // '$store.state.app.device'(value) {
            //     this.resizehandle(value);
            // },
            '$store.state.user.userDetail'(){
                this.getAccount();
            }
        },
        computed: {
            ...mapState('user',[
                'userDetail'
            ]),
            ...mapState('overall',[
                'areaTree',
            ]),
            navbar(){
                return [
                    // {id:"1",path:'/overview',name:'概览',route:{name:'Overview'},hidden:false},
                    { id:"3", path:'/project', name:'项目管理', route:{ name:'Project' }, hidden:false },
                    { id:"4", path:'/senior', name:'高级管理', route:{ name:'Senior' }, hidden: false}
                ];
            }
        },
        methods: {
            //初始化
            initialize(){
                //获取区域树
                if(!this.areaTree.length) this.$store.dispatch('overall/getAreaTree');
                //获取用户详情
                this.getAccount();
                //获取设备类型列表
                judgeEquipTypeMenu();
            },
            //获取用户详情
            getAccount(){
                judgeUserDetail().then(res=>{
                    const { userName, imagePath, name } = res;
                    this.username = userName || 'xxx';
                    this.imagePath = imagePath ? `https://www.eplusview.com:8082/image/user/pic/${imagePath}` : avatar ;
                });
            },
            //判断当前路径,menu高亮
            hightlight(path){
                const index = path.replace('/','a').indexOf('/');
                const result = index ==-1?path:path.slice(0,index);
                this.activeIndex = result
            },
            //菜单激活回调
            selectMenu(){
                !this.phone && this.$store.dispatch('app/toggleSideBar',1)
                sessionStorage.removeItem('project');
            },
            //skipAccount
            skipPage(name){
                this.$router.push({ name })
            },
            //关闭搜索弹窗
            closeSearch(){
                this.flag = false;
                this.closeList()
            },
            //录入二维码字符串
            enteringCode(){
                console.log('录入')
            },
            //全屏
            full(){
                const launchFullScreen = (elem = document.documentElement) => {
                    if(elem.requestFullScreen) {
                        elem.requestFullScreen();
                    } else if(elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if(elem.webkitRequestFullScreen) {
                        elem.webkitRequestFullScreen();
                    }
                }
                launchFullScreen();
            },
            //退出登录
            logout() {
                this.$store.dispatch('user/logout');
            },
            //手机端列表
            moreClick(){
                this.fold = !this.fold;
                this.$refs.Navbar?
                    this.fold?this.$refs.Navbar.style.maxHeight = '500px':this.$refs.Navbar.style.maxHeight = '50px'
                    :''
            },
            //关闭下拉菜单
            closeList(){
                if(!this.phone)return
                this.fold = false;
                setTimeout(()=>{
                    this.$refs.Navbar?this.$refs.Navbar.style.maxHeight = '50px':''
                },300)
            },
            //监听视窗
            // resizehandle(value){
            //     value==='desktop'?this.phone = false :this.phone = true;
            // },
            // 
        }
    }
</script>

<style lang="scss">
    @import '@styles/navbar.scss';
</style>