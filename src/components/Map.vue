<template>
    <div class="amap-page-container">
        <div class="amap_container">
            <el-card class="box-card">
                <div slot="header" class="clearfix" :plugin="plugins">
                    <span>{{title}}</span>
                </div>
                <div>
                    <el-amap 
                        :vid="vid" 
                        class="amap-demo" 
                        :center="center"
                        :zoom="zoom"
                    />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title:{
                type:String
            },
            vid: {
                type: String,
                default: 'amap'
            },
        },
        data(){
            return {
                center: [113.991244,22.595988],
                zoom:3,
                plugins: ['ToolBar']
            }
        },
    }
</script>

<style lang="scss">
    .amap_container{
        background: #fff;
        margin-bottom: 20px;
        box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
        .box-card{
            .el-card__header{
                padding: 8px 15px;
            }
            .clearfix{
                font-size: 16px;
                color: #171717;
            }
        }
        .amap-demo {
            height: 500px;
        }
    }
</style>