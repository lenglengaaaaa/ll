<template>
    <el-backtop :target="target">
        <el-tooltip content="回到顶部" placement="left">
            <div class="box">
                <svg-icon 
                    iconClass="arrowUp" 
                    className="icon"
                />
            </div>
        </el-tooltip>
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
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
        &:hover{
            background: #d3d3d3;
        }
    }
</style>