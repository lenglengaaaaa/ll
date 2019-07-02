<template>
    <el-row :gutter="20" type="flex" >
        <el-col :span="12" :xs="24">
            <div class="data-content" >
                <SoeChart></SoeChart>
            </div>
        </el-col>
        <el-col :span="12" :xs="24">
            <div class="data-content" >
                <CategoryChart></CategoryChart>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import { SoeChart , CategoryChart} from '@/components/Charts'

    export default {
        components: {
            SoeChart,
            CategoryChart
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 768px) {
        .el-row{
                flex-direction: column;
        }
    }
    .el-row {
        margin-bottom: 20px;
        .data-content {
                padding: 30px 0px;
                background: #fff;
                margin-bottom: 20px;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            }
    }
    
</style>