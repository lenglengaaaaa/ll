<template>
    <div class="Home_container">
        <navbar />
        <main>
            <app-main />
        </main>
    </div>
</template>

<script>
    import { Navbar, AppMain } from './components'
    import ResizeMixin from './mixin/ResizeHandler'

    export default {
        components:{
            Navbar,
            AppMain
        },
        mixins:[ResizeMixin],
    }
</script>

<style lang="scss" scoped>
    .Home_container{ 
        height: 100vh;
        width: 100%;
    }
    
</style>