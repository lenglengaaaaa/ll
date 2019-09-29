<template>
    <el-backtop :target="target">
        <div class="box"> UP </div>
    </el-backtop>
</template>

<script>
    export default {
        name:'cc-backtop',
        props: {
            target: String
        },
    }
</script>

<style lang="scss" scoped>
    .box{
        height: 100%;
        width: 100%;
        background-color: #22a7f0;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #fff;
        border-radius: 5px;
    }
</style>