<template>
    <div class="Navbar" ref="Navbar">
        <div class="container">
            <div class='title' >
                <img src="../../assets/img/logo.png" alt="logo">
            </div>
            <div class="menu" v-if='!phone'>
                <div class="left_menu">
                    <el-menu 
                        :default-active="activeIndex"
                        class="el-menu-demo" 
                        mode="horizontal" 
                        text-color="#fff"
                        router
                    >   
                        <el-menu-item v-for="item in navbar" :key="item.path" :index="item.path">
                            {{ item.name }}
                        </el-menu-item>
                    </el-menu>
                </div>
                
                <div class="right_menu">
                    <i class="el-icon-search" @click="flag = true"/>
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper">
                            <img src="../../assets/img/avatar.gif" class="user-avatar">
                            <span class="username" >{{username}}</span>
                            <i class="el-icon-caret-bottom" />
                        </div>
                        <el-dropdown-menu slot="dropdown" class="user-dropdown">
                            <el-dropdown-item>
                                <span style="display:block;" @click="logout">退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="phone_list" v-else>
                <i class="el-icon-more" @click="moreClick"></i>
            </div>
        </div>

        <div class="list" ref="list" v-if="phone">
            <el-menu 
                :default-active="activeIndex"
                @select="handleSelect"
                router
            >   
                <el-menu-item v-for="item in navbar" :key="item.path" :index="item.path">
                    {{ item.name }}
                </el-menu-item>
                <el-menu-item @click="flag=true">搜索</el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <img src="../../assets/img/avatar.png" />
                        <span>{{username}}</span>
                    </template>
                    <el-menu-item @click="logout" index="1-1">退出登录</el-menu-item>
                </el-submenu>

            </el-menu>
        </div>

        <GlobalSearch :visible="flag" :close="closeSearch"/>
    </div>
</template>

<script>
    import GlobalSearch from './GlobalSearch'


    export default {
        name:'Header',
        data() {
            return {
                activeIndex: '',
                navbar:[
                    {path:'/overview',name:'概览'},
                    {path:'/gateway',name:'网关管理'},
                    {path:'/application',name:'应用管理'},
                    {path:'/senior',name:'高级管理'}
                ],
                flag:false,
                phone:false,
                fold:false,
                username:''
            }
        },
        components: {
            GlobalSearch,
        },
        mounted () {
            //这里进行权限配置,改变navbar
            this.username = this.$store.state.name;
            this.activeIndex = this.$route.path
            window.addEventListener('resize', this.scrollhandle);
            this.scrollhandle()
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.scrollhandle);
        },
        watch: {
            $route(to,from){
                this.activeIndex = to.path
            }
        },
        methods: {
            //el-menu点击事件
            handleSelect(key, keyPath) {
                this.closeList()
            },
            //关闭搜索弹窗
            closeSearch(){
                this.flag = false;
                this.closeList()
            },
            //退出登录
            async logout() {
                await this.$store.dispatch('logout')
                this.$router.push(`/login`)
            },
            //手机端列表
            moreClick(){
                this.fold = !this.fold;
                this.$refs.Navbar.style.maxHeight =this.fold? `500px`:'50px'
            },
            //关闭下拉菜单
            closeList(){
                if(!this.phone)return
                this.fold = false;
                setTimeout(()=>{
                    this.$refs.Navbar.style.maxHeight = '50px';
                },300)
            },
            //监听视窗
            scrollhandle(){
                const screenWidth = document.body.clientWidth;
                screenWidth>769?this.phone = false :this.phone = true;
            }
        }
    }
</script>

<style lang="scss">
    $height:50px;
    .Navbar{
        width: 100vw;
        max-height: 50px;
        background: linear-gradient(135deg,#22a7f0,#22a7f0,#36d7b7);
        transition: max-height 0.5s;
        overflow: hidden;
        position: fixed;
        top:0;
        left: 0;
        z-index: 1030;
        .container{
            height: $height;
            padding: 0 35px;
            .title{
                float: left;
                height: 100%;
                flex: 0;
                padding-right:40px; 
                display: flex;
                align-items: center;
                img{
                    width: 145px;
                }
            }
            .menu{
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 2;
                .left_menu{
                    height: $height;
                    .el-menu-demo{
                        background: transparent;
                        border: none;
                    }
                    .el-menu--horizontal{
                        .el-menu-item{
                            border-bottom: none;
                            width: 100px;
                            height: $height;
                            text-align: center;
                            line-height: $height;
                        }
                        .el-menu-item:not(.is-disabled):hover{
                            &:hover{
                                background: #3498db;
                            }
                        }
                        & > .el-menu-item.is-active{
                            border-bottom: none;
                            color: #fff;
                            background: #4183d7;
                        }
                    }
                }
                .right_menu{
                    height: $height;
                    display: flex;
                    align-items: center;
                    .el-icon-setting,.el-icon-search{
                        padding: 0px 20px;
                        color: #fff;
                        cursor: pointer;
                    }
                    .avatar-container {
                        .avatar-wrapper {
                            display: flex;
                            align-items: center;
                            color: #fff;
                            cursor: pointer;
                            .user-avatar {
                                width: 40px;
                                height: 40px;
                                border-radius: 10px;
                            }
                            .username{
                                padding:0 10px;
                                font-size: 14px;
                            }
                            .el-icon-caret-bottom {
                                padding: 0px 5px;
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
            .phone_list{
                height: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .el-icon-more{
                    font-size: 24px;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
        .list{
            border-top: 1px solid #d8d6d6;
            margin: 0 35px;
            .el-menu{
                margin: 7.5px 0;
                background: transparent;
                border: none;
                .el-menu-item,.el-submenu__title{
                    color: #fff;
                    border-bottom: none;
                    height: 40px;
                    line-height: 40px;
                }
                .el-submenu__title{
                    i{
                        color: #fff;
                    }
                    &:hover{
                        background: transparent;
                    }
                }
                & > .el-menu-item.is-active{
                    border-bottom: none;
                    color: #fff;
                    background: #4183d7;
                }
                
            }
        }
    }
</style>