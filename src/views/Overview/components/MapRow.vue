<template>
    <el-row :gutter="20" type="flex" class="mapRow">
        <el-col :span="12" :xs="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <span>设备地图</span>
                    <el-button class="clearfix-right" type="text" @click="magnify('equip')">放大</el-button>
                </div>
                <cc-map  
                    vid="appliaction"
                    :marker="deviceMarkers"
                />
            </el-card>
        </el-col>
        <el-col :span="12" :xs="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <span>网关地图</span>
                    <el-button class="clearfix-right" type="text" @click="magnify('gateway')">放大</el-button>
                </div>
                <cc-map 
                    vid="gateway"
                    :marker="gatewayMarkers"
                    v-if="flag"
                />
            </el-card>
        </el-col>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            top="7vh"
            width="75%"
            class="mapDialog"
            :before-close="handleClose"
            center
            destroy-on-close
        >
            <cc-map  
                vid="magnify"
                :marker="dialogMarkers"
            />
        </el-dialog>
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
                dialogMarkers:[],
                dialogTitle:'',
                flag:false,
                dialogVisible: false
            }
        },
        mounted () {
            this.initiate();
            sleep(1000).then(()=>{
                this.flag = true;
            })
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
            },
            magnify(title){
                this.dialogMarkers = [];
                this.dialogVisible = true;
                this.dialogTitle = title === 'equip'? '设备地图': '网关地图';
                this.dialogMarkers = title === 'equip' ? this.deviceMarkers : this.gatewayMarkers;
            },
            handleClose(done) {
                done();
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
                .box-card{
                    .clearfix{
                        &-right{
                            display: none;
                        }
                    }
                }
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
                    &-right{
                        float: right; padding: 3px 0
                    }
                }
                .el-card__body{
                    box-sizing: border-box;
                    padding: 10px;
                    height: calc(100% - 38px);
                }
                .map{
                        height: calc(100% - 0px);
                }
                @media screen and (max-width: 870px){
                    .map{
                        height: 500px;
                    }
                }
            }
        }
    }
    .mapDialog{
        .el-dialog__header{
            border-radius: 10px 10px 0px 0px;
            padding: 12px 20px;
            background-color: #eee;
            
            .el-dialog__title{
                font-weight: bold;
            }
            .el-dialog__headerbtn{
                top: 15px;
            }
        }
        .el-dialog__body{
            padding: 0px;
            .map{
                height: 700px;
            }
        }
    }
</style>