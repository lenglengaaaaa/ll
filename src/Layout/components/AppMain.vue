<template>
    <section class="app-main">
        <div class="wrapper">
            <transition name="fade-transform" mode="out-in">
                <router-view :key="key" />
            </transition>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 796px) {
        .wrapper{
            padding: 0px !important;
        }
    }
    .app-main{
        padding-top:50px; 
        height: calc(100vh - 50px);
        background: #ecefef;
        .wrapper{
            padding:10px 1vw;
            height: calc(100% - 20px);
            overflow-y: scroll;
        }
    }
</style>