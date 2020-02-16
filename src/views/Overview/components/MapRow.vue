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
                        :marker="deviceMarkers"
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
                        :marker="gatewayMarkers"
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
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                deviceMarkers:[],
                gatewayMarkers:[],
                flag:false,
                mapHeight:0
            }
        },
        created () {
            window.addEventListener('resize',()=>{
                this.mapHeight = this.$('.el-card__body').height();
            },false);
        },
        mounted () {
            this.initiate();
            sleep(1000).then(()=>{
                this.flag = true;
            })
            this.mapHeight = this.$('.el-card__body').height();
        },
        methods: {
            ...mapActions('overall',[
                'getDeviceAddressInAll',
                'getGatewayAddressInAll'
            ]),
            initiate(){
                Promise.all([this.getDeviceAddressInAll(),this.getGatewayAddressInAll()]).then(res=>{
                    const [device,gateway] = res;
                    this.deviceMarkers = device || [];
                    this.gatewayMarkers = gateway || [];
                })
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .mapRow{
            flex-direction: column;
            .el-col{
                margin: 10px 0 !important;
            }
        }
    }
    .mapRow{
        .el-col{
            padding: 0px !important;
            height: 100%;
            flex: 1;
            &:nth-child(1){
                margin: 0px 10px 0 10px;
            }
            .box-card{
                border-radius: 5px;
                height:calc(100% - 1px);
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