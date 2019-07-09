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

    export default {
        components: {
            Breadcrumb,
        },
        data() {
            return {
                bread: [],
                flag:false,
                
            }
        },
        mounted () {
            const screen = this.$store.state.app.device;
            this.fitScreen(screen)
        },
        watch: {
            '$store.state.app.device'(screen){
                this.fitScreen(screen)
            },
            '$store.state.app.sidebar.opened'(flag) {
                const type = this.$store.state.app.device;
                if(type ==='mobile')return;
                $('.apply_main').css({width:!flag?'calc(100% - 54px)':'calc(100% - 210px)'})
            }
        },
        computed: {
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            fitScreen(screen){
                if(screen ==='mobile'){
                    $('.apply_main').css({width:''})
                } 
                if(screen ==='desktop'){
                    const fold = this.$store.state.app.sidebar.opened;
                    $('.apply_main').css({width:!fold?'calc(100% - 54px)':'calc(100% - 210px)'})
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .apply_main{
            .bar{
                margin: 0 0 15px 0 !important;
            }
        }
    }
    .apply_main{
        width: 100%;
        height: 100%;
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
            }
            .el-breadcrumb{
                padding-left: 10px;
            }
        }
        .main{
            padding:0 15px 15px;
            height: calc(100vh - 145px);
            overflow: scroll;
        }
    }
</style>