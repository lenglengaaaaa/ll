<template>
    <div class="Apply_container">
        <SideBar />
        <AppMain />
    </div>
</template>

<script>
    import SideBar from './components/SideBar'
    import AppMain from './components/Main'

    export default {
        components: {
            SideBar,
            AppMain
        },
    }
</script>

<style lang="scss">
    // .app-main{
    //     .wrapper{
    //         padding: 0px ;
    //         height: 100%;
    //     }
    // }
    .Apply_container{
        display: flex;
        flex-direction: row;
        height: 100%;
    }
</style>