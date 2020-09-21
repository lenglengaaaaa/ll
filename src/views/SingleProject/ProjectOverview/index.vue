<template>
    <div class="pjOverview">
        <el-row :gutter="15" type="flex" class="box_row">
            <el-col :span="10" :xs="24" class="chartBox">
                <el-card  class="box-card">
                    <div slot="header" class="clearfix"  >
                        <span>项目SOE总数</span>
                    </div>
                    <SoeChart
                        v-if="soeCount.length"
                        :soeCount="soeCount"
                    />
                    <cc-empty v-else/>
                </el-card>
                <el-card 
                    class="box-card" 
                >
                    <div slot="header" class="clearfix"  >
                        <span>项目设备数量</span>
                    </div>
                    <CategoryChart
                        v-if="equipList.length" 
                        :equipList="equipList"
                    />
                    <cc-empty v-else/>
                </el-card>
            </el-col>
            <el-col :span="14" :xs="24" class="mapBox">
                <el-card  class="box-card">
                    <div slot="header" class="clearfix"  >
                        <span>设备地图</span>
                    </div>
                    <cc-map 
                        :marker="marker"
                        vid="apply"
                        :zoom="19"
                        hasUpdate
                    />
                    <div class="hint" >
                        <div class="tip">
                            <img src="@images/equip_icon.png" alt="">
                            <span>设备</span>
                        </div>
                        <template v-if="hasCablePile">
                            <div class="tip">
                                <img src="@images/Cable/skewing.png" alt="">
                                <span>定位桩-正常状态</span>
                            </div>
                            <div class="tip">
                                <img src="@images/Cable/lean.png" alt="">
                                <span>定位桩-倾斜状态</span>
                            </div>
                        </template>
                        
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import { mapActions, mapState } from 'vuex'
    
    export default {
        components: {
            SoeChart,
            CategoryChart,
        },
        data() {
            return {
                equipList:[],
                soeCount:[],
                marker:[],
                hasCablePile:false
            }
        },
        mounted () {
            this.getCount();
            this.getSoe();
            this.getLocation();
        },
        computed: {
            ...mapState('equip',[
                'equipTypeMenu',
            ]),
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            ...mapActions('overall',[
                'getEquipCount',
                'getSoeCount',
                'getDeviceAddress'
            ]),
            //获取设备数量
            getCount(){
                this.getEquipCount(this.projectId).then(res=>{
                    if(!res) return;
                    const result = res.reduce((pre,current)=>{
                        for(let item of this.equipTypeMenu){
                            if(current.deviceType === item.id){
                                current.name = item.value;
                                current.value = current.count;
                            }
                        }
                        return [...pre,current]
                    },[])
                    this.equipList = result;
                })
            },
            //获取SOE数量
            getSoe(){
                let startTime = this.$moment().startOf('year').format('YYYY-MM-DD');
                let endTime = this.$moment().endOf('year').format('YYYY-MM-DD');
                this.getSoeCount({
                    query:this.projectId,
                    queryType:0,
                    startTime,
                    endTime,
                    timeType:0
                }).then(res=>{
                    if(!res)return;
                    this.soeCount = Object.values(res);
                })
            },
            //获取设备的经纬度、位置信息
            getLocation(){
                this.getDeviceAddress(this.projectId).then(res=>{
                    if(!res)return;

                    this.hasCablePile = res.some(k=> k.deviceType == 40);
                    this.marker = res;
                })
            }
        },
    }
</script>

<style lang="scss" >
    .pjOverview{
        height: 100%;
        .box_row{
            height: 100%;
            .box-card{
                .el-card__header{
                    padding: 8px 15px;
                }
                .el-card__body{
                    height: calc(100% - 80px);
                }
                .clearfix{
                    font-size: 0.8rem;
                    font-weight: bold;
                    color: #171717;
                }
            }
            .chartBox{
                height: 100%;
                .box-card{
                    height: 49.5%;
                    &:nth-child(1){
                        margin-bottom: 1%;
                    }
                    #soe,#category{
                        height: calc(100% - 0px);
                    }
                }
            }
            .mapBox{
                height: 100%;
                .box-card{
                    height: 100%;
                    position: relative;
                    .map_all{
                        height:calc(100% - 0px);
                    }
                    .hint{
                        position: absolute;
                        top: 70px;
                        right: 30px;
                        background: white;
                        border-radius: 10px;
                        padding: 15px 10px 10px;
                        .tip{
                            display: flex;
                            align-items: center;
                            padding-bottom:5px;
                            img{
                                width: 20px;
                                height: 20px;
                                margin-right: 5px;
                            }
                            span{
                                font-weight: bold;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
        @media screen and (max-width: 870px){
            .el-row{
                flex-direction: column;
                .chartBox{
                    height: 800px;
                    margin-bottom: 10px;
                } 
                .mapBox{
                    .box-card{
                        height: 500px !important;
                    }
                }
            }
        }
    }
</style>