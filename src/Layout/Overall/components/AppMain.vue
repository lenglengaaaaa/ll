<template>
    <section class="app-main">
        <!-- <transition name="fade-transform" mode="out-in"> -->
            <router-view />
        <!-- </transition> -->
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        // computed: {
        //     key() {
        //         return this.$route.path
        //     }
        // }
    }
</script>

<style lang="scss">
    .app-main{
        padding-top:50px; 
        height: calc(100vh - 50px);
        background: #ecefef;
        overflow-y: scroll;
    }
</style>