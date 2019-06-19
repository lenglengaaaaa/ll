<template>
    <div class="Sidebar_container">
        <div class="app_title">
            <p v-if="!isCollapse">新魔节测试</p>
            <i v-else class="el-icon-info" title="新魔节测试"></i>
        </div>
        <el-menu 
            :default-active="activeIndex"
            class="el-menu-demo" 
            text-color="#fff"
            active-text-color="#fff"
            router
            :collapse="isCollapse"
            :collapse-transition="false"
        >   
            <el-menu-item v-for="item in routes" :key="item.path" :index="item.name" :route="{name:item.name}">
                <i :class="item.meta.icon"></i>
                <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: '',
                isCollapse:false
            }
        },
        watch: {
            $route(to,from){
                this.activeIndex = to.name;
            },
            '$store.state.app.isCollapse'(value) {
                this.isCollapse = value;
                if(value){
                    $('.Sidebar_container').css("width",'64px')
                }else{
                    $('.Sidebar_container').css("width",'200px')
                }
            },
        },
        computed: {
            routes() {
                const routes = this.$router.options.routes ;
                const index = routes.findIndex((item)=>item.path ==='/application');
                const result = routes[index].children[1].children;
                return result
            }
        },
        mounted () {
            this.activeIndex = this.$route.name;
        },
    }
</script>

<style lang="scss">
    $height: 50px;
    .Sidebar_container{
        width: 200px;
        background: #2c3e50;
        .app_title{
            height: $height;
            display: flex;
            justify-content: center;
            align-items: center;
            p{
                margin: 0;
                color: #dadfe1;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
            }
            .el-icon-info{
                color: #fff;
                cursor: pointer;
            }
        }
        .el-menu-demo{
            width: 100%;
            background:transparent;
            .el-menu-item{
                height: $height;
                line-height: $height;
                &:hover{
                    background: #22a7f0;
                }
            }
            .is-active{
                background: #22a7f0;
            }
        }
    }
</style>