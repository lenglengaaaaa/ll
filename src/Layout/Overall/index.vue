<template>
    <div class="Home_container">
        <navbar />
        <main>
            <app-main />
        </main>
    </div>
</template>

<script>
    import Navbar from './components/Navbar'
    import AppMain from './components/AppMain'

    export default {
        components:{
            Navbar,
            AppMain
        }
    }
</script>

<style lang="scss" scoped>
    .Home_container{ 
        height: 100vh;
        width: 100%;
    }
    
</style>