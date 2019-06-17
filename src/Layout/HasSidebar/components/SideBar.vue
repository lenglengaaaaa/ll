<template>
    <div class="Sidebar_container">
        <el-menu 
            :default-active="activeIndex"
            class="el-menu-demo" 
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
        >   
            <el-menu-item v-for="item in menu" :key="item.path" :index="item.path" :route="item.route">
                {{ item.name }}
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: '',
                menu:[
                    {path:'ApplyOverview',name:'应用总览',route:{name:'ApplyOverview'}},
                    {path:'Concentrator',name:'集中器管理',route:{name:'Concentrator'}},
                ],
            }
        },
        watch: {
            $route(to,from){
                this.activeIndex = to.name;
            },
        },
        mounted () {
            this.activeIndex = this.$route.name;
        },
        methods: {

        },
    }
</script>

<style lang="scss" scoped>
    .Sidebar_container{
        .el-menu-demo{
            width: 200px;
            height: 100%;
            text-align: center;
        }
    }
</style>