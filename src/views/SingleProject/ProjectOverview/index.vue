<template>
    <div class="pjOverview">
        <el-row :gutter="15" type="flex" >
            <el-col :span="8" :xs="24" class="chartBox">
                <el-card 
                    class="box-card" 
                    :body-style="{height: 'calc(100% - 77px)'}"
                >
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
                    :body-style="{height: 'calc(100% - 77px)'}"
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
                <!-- <div class="data-content" >
                    <CategoryChart
                        v-if="equipList.length" 
                        :equipList="equipList"
                    />
                    <cc-empty v-else/>
                </div> -->
            </el-col>
            <el-col :span="16" :xs="24" class="mapBox">
                <el-card 
                    class="box-card" 
                    :body-style="{height: 'calc(100% - 77px)'}"
                >
                    <div slot="header" class="clearfix"  >
                        <span>设备地图</span>
                    </div>
                    <cc-map 
                        :marker="marker"
                        vid="apply"
                        :zoom="19"
                    />
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import { mapActions } from 'vuex'
    
    export default {
        components: {
            SoeChart,
            CategoryChart,
        },
        data() {
            return {
                equipList:[],
                soeCount:[],
                marker:[]
            }
        },
        mounted () {
            this.getCount();
            this.getSoe();
            this.getLocation();
        },
        computed: {
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
                const equipTypeMenu = this.$store.state.equip.equipTypeMenu;
                this.getEquipCount(this.projectId).then(res=>{
                    if(!res) return;
                    const result = res.reduce((pre,current)=>{
                        for(let item of equipTypeMenu){
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
                    this.marker = res;
                })
            }
        },
    }
</script>

<style lang="scss" >
    @media screen and (max-width: 870px) {
        .pjOverview{
            .el-row{
                flex-direction: column;
                .chartBox{
                    .box-card{
                        height: 500px;
                        margin-bottom: 10px;
                    }
                }   
                .mapBox{
                    .box-card{
                        .map{
                            height: 500px;
                        }
                    }   
                }
            }
        }
    }
    .pjOverview{
        height: 100%;
        .el-row {
            height: inherit;
            .chartBox{
                display: flex;
                flex-direction: column;
                .box-card{
                    flex:1;
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
                    #soe,#category{
                        height: calc(100% - 0px);
                    }
                    &:nth-child(1){
                        margin-bottom: 10px;
                    }
                }
            }
            .chartBox{
                display: flex;
                flex-direction: column;
                .data-content {
                    flex: 1;
                    padding: 15px 0px;
                    background: #fff;
                    box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                    border-radius: 10px;
                    &:nth-child(1){
                        margin-bottom: 10px;
                    }
                    #soe,#category{
                        height: calc(100% - 0px);
                    }
                }
            }
            .mapBox{
                .box-card{
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
                    .map{
                        height: calc(100% - 0px) ;
                    }
                    @media screen and (max-width: 870px){
                        .map{
                            height: 500px;
                        }
                    }
                }
            }
        }
    }
</style>