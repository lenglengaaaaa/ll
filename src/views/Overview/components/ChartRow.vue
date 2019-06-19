<template>
    <el-row :gutter="20" type="flex" >
        <el-col :span="span" >
            <div class="data-content" >
                <SoeChart></SoeChart>
            </div>
        </el-col>
        <el-col :span="span" >
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
        },
        props: {
            width: {
                type: Number,
                default:document.body.clientWidth
            }
        },
        data() {
            return {
                span: 12
            }
        },
        mounted () {
            const value = this.$store.state.app.device;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.app.device'(value) {
                this.resizehandle(value) ;
            }
        },
        methods: {
            resizehandle(value){
                value==="desktop"?this.span=12 :this.span = 24
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 992px) {
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