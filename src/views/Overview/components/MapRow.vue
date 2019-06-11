<template>
    <el-row :gutter="20" type="flex" >
        <el-col :span="span" >
            <Map 
                vid="appliaction"
                title="设备地图"
            />
        </el-col>
        <el-col :span="span">
            <Map 
                vid="gateway"
                title="网关地图"
            />
        </el-col>
    </el-row>
</template>

<script>
    import Map from '@/components/Map'

    export default {
        components: {
            Map
        },
        props: {
            width: {
                type: Number,
                default:0 
            }
        },
        data() {
            return {
                span: 12
            }
        },
        mounted () {
            const value = this.$store.state.screenWidth;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.screenWidth'(value) {
                this.resizehandle(value) ;
            }
        },
        methods: {
            resizehandle(value){
                value>769?this.span=12 :this.span = 24
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 769px) {
        .el-row{
                flex-direction: column;
        }
    }
</style>