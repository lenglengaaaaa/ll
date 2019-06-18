<template>
    <el-row :gutter="20" type="flex" >
        <el-col :span="span" >
            <el-card class="box-card">
                <div slot="header" class="clearfix"  >
                    <span>设备地图</span>
                </div>
                <div>
                    <Map 
                        vid="appliaction"
                        :marker="marker"
                    />
                </div>
            </el-card>
        </el-col>
        <el-col :span="span">
            <el-card class="box-card">
                <div slot="header" class="clearfix"  >
                    <span>网关地图</span>
                </div>
                <div>
                    <Map 
                        vid="gateway"
                        :marker="marker"
                    />
                </div>
            </el-card>
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
                span: 12,
                marker:[]
            }
        },
        created () {
            let marker = [];
            for (let i = 0 ; i < 10 ; i ++) {
                marker.push({
                    position: [121.59996, 31.197646 + i * 0.001],
                });
            }
            this.marker=marker;
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
    .box-card{
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-card__header{
                padding: 8px 15px;
            }
            .clearfix{
                font-size: 16px;
                color: #171717;
            }
        }
</style>