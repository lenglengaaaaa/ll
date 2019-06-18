<template>
    <section class="apply_main">
        <div class="bar">
            <i :class="!flag?'el-icon-s-fold':'el-icon-s-unfold'" @click="swState"/>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item 
                    v-for="item in bread" 
                    :key="item.name" 
                    :to="{ name: item.name }"
                >
                    {{item.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <transition name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                bread: [],
                flag:false,
                
            }
        },
        watch:{
            '$store.state.app.breadcrumbs'(value){
                this.bread = value
            }
        },
        computed: {
            key() {
                return this.$route.path
            }
        },
        methods: {
            swState() {
                this.flag = !this.flag
                this.$store.commit('app/SET_STATUS',this.flag)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .apply_main{
        width: 100%;
        height: 100%;
        .bar{
            height: 50px;
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
            padding:0 15px;
        }
    }
</style>