<template>
    <el-row :gutter="20" type="flex" >
        <el-col :span="12" :xs="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <span>设备地图</span>
                </div>
                <div>
                    <cc-map  
                        vid="appliaction"
                        :marker="marker"
                    />
                </div>
            </el-card>
        </el-col>
        <el-col :span="12" :xs="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <span>网关地图</span>
                </div>
                <div>
                    <cc-map 
                        vid="gateway"
                        :marker="marker"
                        v-if="flag"
                    />
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
                marker:[],
                flag:false,
            }
        },
        created () {
            let marker = [];
            for (let i = 0 ; i < 10 ; i ++) {
                marker.push({
                    longitude:121.59996,
                    latitude:31.197646 + i * 0.001,
                    name:i
                });
            }
            this.marker=marker;
        },
        mounted () {
            setTimeout(()=>{
                this.flag =true;
            },300)
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .el-row{
                flex-direction: column;
        }
    }
    .box-card{
            height: 600px;
            margin-bottom: 20px;
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-card__header{
                padding: 8px 15px;
            }
            .clearfix{
                font-size: 0.9rem;
                font-weight: bold;
                color: #171717;
            }
        }
</style>