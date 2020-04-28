<template>
    <section class="apply_main">
        <div class="bar">
            <i :class="isCollapse?'el-icon-s-fold':'el-icon-s-unfold'" @click="toggleSideBar"/>
            <Breadcrumb />
        </div>
        <div class="main">
            <transition name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
    </section>
</template>

<script>
    import Breadcrumb from '@/components/Breadcrumb'
    import {xyTransformation} from '@/utils/methods'

    export default {
        components: {
            Breadcrumb,
        },
        data() {
            return {
                bread: [],
                flag:false,
                client:null
            }
        },
        mounted () {
            const screen = this.$store.state.app.device;
            this.fitScreen(screen)
        },
        destroyed () {
            this.client&&this.client.end();
        },
        watch: {
            '$store.state.app.device'(screen){
                this.fitScreen(screen)
            },
            '$store.state.app.sidebar.opened'(flag) {
                const type = this.$store.state.app.device;
                if(type ==='mobile')return;
                this.$('.apply_main').css({width:!flag?'calc(100% - 54px)':'calc(100% - 210px)'})
            },
            //暂时用于无权限监听关闭mqtt
            $route(to,from){
                if(to.redirectedFrom==='/senior'){
                    this.client&&this.client.end();
                }
            },
        },
        computed: {
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            fitScreen(screen){
                if(screen ==='mobile'){
                    this.$('.apply_main').css({width:''})
                } 
                if(screen ==='desktop'){
                    const fold = this.$store.state.app.sidebar.opened;
                    this.$('.apply_main').css({width:!fold?'calc(100% - 54px)':'calc(100% - 210px)'})
                }
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .apply_main{
            .bar{
                margin: 0 0 15px 0 !important;
            }
        }
    }
    .loadingMsg{
        margin-left: 20px;
    }
    .apply_main{
        width: 100%;
        // height: 100%;
        .bar{
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            height: 50px;
            margin: 15px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            .el-icon-s-fold,.el-icon-s-unfold{
                cursor: pointer;
                font-size: 20px;
            }
            .el-breadcrumb{
                padding-left: 10px;
            }
        }
        .main{
            padding:0 15px 15px;
            height: calc(100vh - 145px);
            overflow: auto;
        }
    }
    
    
</style>