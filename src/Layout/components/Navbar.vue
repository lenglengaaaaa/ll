<template>
    <div class="Navbar">
        <div class="container">
            <div class='title'>
                <img src="../../assets/img/logo.png" alt="logo">
            </div>
            <div class="menu">
                <div class="left_menu">
                    <el-menu 
                        :default-active="activeIndex" 
                        :active="activeIndex"
                        class="el-menu-demo" 
                        mode="horizontal" 
                        @select="handleSelect"
                        text-color="#fff"
                        router
                    >   
                        <el-menu-item v-for="item in navbar" :key="item.id" :index="item.path">
                            {{ item.name }}
                        </el-menu-item>
                    </el-menu>
                </div>
                <div class="right_menu">
                    <i class="el-icon-search" @click="flag = true"/>
                    <i class="el-icon-setting" @click="senior"/>
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper">
                            <img src="../../assets/img/avatar.gif" class="user-avatar">
                            <span class="username">Zain</span>
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
                activeIndex: 'overview',
                navbar:[
                    {id:1,path:'overview',name:'概览'},
                    {id:2,path:'gateway',name:'网关管理'},
                    {id:3,path:'application',name:'应用管理'}
                ],
                flag:false
            }
        },
        components: {
            GlobalSearch,
        },
        created () {
            //这里进行权限配置,改变navbar
            if(this.$route.path ==="/senior"){
                this.activeIndex = ""
            }else{
                this.activeIndex = this.$route.path.slice(1)
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            senior(){
                this.activeIndex=''
                this.$router.push(`/senior`)
            },
            closeSearch(){
                this.flag = false;
            },
            async logout() {
                await this.$store.dispatch('logout')
                this.$router.push(`/login`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    $height:50px;
    .Navbar{
        height: $height;
        background: linear-gradient(135deg,#22a7f0,#22a7f0,#36d7b7);
        padding: 0 20px;
        .container{
            height: $height;
            display: flex;
            padding: 0 15px;
            .title{
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
        }
    }
</style>