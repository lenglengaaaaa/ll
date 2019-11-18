<template>
    <el-row :gutter="20" type="flex" class="mapRow">
        <el-col :span="12" :xs="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <span>设备地图</span>
                </div>
                <div>
                    <cc-map  
                        vid="appliaction"
                        :marker="marker"
                        :mapHeight="mapHeight"
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
                        :mapHeight="mapHeight"
                    />
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import {sleep} from '@/utils/methods'

    export default {
        data() {
            return {
                marker:[],
                flag:false,
                cardHeight:0,
                mapHeight:0
            }
        },
        mounted () {
            sleep(500).then(()=>{
                this.flag = true;
            })
            this.mapHeight = this.$('.el-card__body').height();
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

            window.addEventListener('resize',()=>{
                this.cardHeight = this.$('.el-card__body').height();
            },false);
        },
        watch: {
            cardHeight(newValue, oldValue) {
                if(newValue !== oldValue){
                    this.mapHeight = this.$('.el-card__body').height();
                }
            }
        }
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .mapRow{
            flex-direction: column;
            .el-col{
                margin: 10px 0 !important;
                .box-card{
                    .el-card__body{
                        height: 500px !important;
                    }
                }
            }
        }
    }
    .mapRow{
        .el-col{
            padding: 0px !important;
            &:nth-child(1){
                margin: 0px 10px 0 10px;
            }
            .box-card{
                border-radius: 5px;
                height: 100%;
                background: #fff;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                .el-card__header{
                    padding: 8px 15px;
                }
                .clearfix{
                    font-size: 0.8rem;
                    font-weight: bold;
                    color: #171717;
                }
                .el-card__body{
                    box-sizing: border-box;
                    padding: 10px;
                    height: calc(100% - 38px);
                }
            }
        }
    }
    
</style>