<template>
    <div class="Apply_container">
        <SideBar />
        <AppMain />
    </div>
</template>

<script>
    import { SideBar, AppMain } from './components'
    export default {
        components: {
            SideBar,
            AppMain
        },
    }
</script>

<style lang="scss" scope>
    .Apply_container{
        display: flex;
        flex-direction: row;
        height: 100%;
    }
</style>