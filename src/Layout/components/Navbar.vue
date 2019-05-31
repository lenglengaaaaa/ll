<template>
    <div class="Navbar">
        <div class="container">
            <div class='title'>
                <img src="../../assets/img/logo.png" alt="logo">
            </div>
            <div class="menu">
                <el-menu 
                    :default-active="activeIndex" 
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
        </div>
    </div>
</template>

<script>
    export default {
        name:'Header',
        data() {
            return {
                activeIndex: 'overview',
                navbar:[
                    {id:1,path:'overview',name:'概览'},
                    {id:2,path:'application',name:'网关管理'},
                    {id:3,path:'gateway',name:'应用管理'}
                ]
            }
        },
        created () {
            //这里进行权限配置,改变navbar
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .Navbar{
        height: 60px;
        background: linear-gradient(135deg,#22a7f0,#22a7f0,#36d7b7);
        padding: 0 20px;
        .container{
            display: flex;
            align-items: center;
            padding: 0 15px;
            .title{
                display: flex;
                align-items: center;
                padding-right:40px; 
                img{
                    width: 145px;
                }
            }
            .menu{
                .el-menu-demo{
                    background: transparent;
                    
                }
                .el-menu--horizontal{
                    .el-menu-item{
                        border-bottom: none;
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
        }
    }
</style>