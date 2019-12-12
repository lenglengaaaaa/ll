<template>
    <div class="Overview_container">
        <div class="title_bar">
            <span>
                欢迎使用E+view物联网云平台
            </span>
        </div>
        <div class="body">
            <el-row :gutter="0" class="row-wrap" type="flex">
                <el-col :span="4" :xs="24">
                    <CountRow />
                </el-col>
                <el-col :span="20" :xs="24">
                    <div class="body-right">
                        <div class="body-right-top">
                            <el-row :gutter="20" type="flex" class="chart-wrap">
                                <el-col :span="12" :xs="24">
                                    <el-card class="box-card">
                                        <div slot="header" class="clearfix" >
                                            <span>SOE总数</span>
                                        </div>
                                        <div class="data-content" >
                                            <SoeChart
                                                v-if="soeCount.length"
                                                :soeCount="soeCount"
                                            />
                                            <cc-empty v-else/>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="12" :xs="24">
                                    <el-card class="box-card">
                                        <div slot="header" class="clearfix" >
                                            <span>设备数量</span>
                                        </div>
                                        <div class="data-content" >
                                            <CategoryChart
                                                v-if="equipList.length" 
                                                :equipList="equipList"
                                            />
                                            <cc-empty v-else/>
                                        </div>
                                    </el-card>
                                    
                                </el-col>
                            </el-row>
                        </div>
                        <div class="body-right-bottom">
                            <MapRow />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <cc-backtop target=".Overview_container"/>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import CountRow from './components/CountRow'
    import MapRow from './components/MapRow'

    export default {
        components:{
            CountRow,
            SoeChart,
            CategoryChart,
            MapRow
        },
        data() {
            return {
                equipList:[],
                soeCount:[]
            }
        },
        beforeMount() {
            const flag = sessionStorage.getItem('equipTypeMenu');
            !flag && this.$store.dispatch('equip/getEquipTypeMenu');
        },
        mounted () {
            this.getSoe();
            this.getCount();
        },
        computed: {
            equipTypeMenu() {
                return this.$store.state.equip.equipTypeMenu; 
            }
        },
        methods: {
            ...mapActions('overall',[
                'getEquipCount',
                'getSoeCount',
                'getDeviceAddress'
            ]),
            //初始化
            // initial(){
                // this.getSoe();
                // (async ()=>{
                //     const flag = sessionStorage.getItem('equipTypeMenu');
                //     await !flag && this.$store.dispatch('equip/getEquipTypeMenu');
                //     await this.getCount();
                // })()
            // },
            //获取设备数量
            getCount(){
                this.getEquipCount(0).then(res=>{
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
                    query:null,
                    queryType:0,
                    startTime,
                    endTime,
                    timeType:0
                }).then(res=>{
                    if(!res)return;
                    this.soeCount = Object.values(res);
                })
            },
        },
    }
</script>

<style lang="scss" scope>
    @media screen and (max-width: 870px) {
        .Overview_container{
            padding: 0px !important;
            .body{
                padding: 0 20px;
                height: auto !important;
                .row-wrap,.chart-wrap{
                    flex-direction: column;
                }
                &-right{
                    &-top{
                        margin-bottom: 0px !important;
                        .el-col{
                            margin: 10px 0 !important;
                        }
                    }
                }
            }
        }
    }
    .Overview_container{
        padding:10px 1vw;
        height: calc(100% - 20px);
        overflow: auto;
        .title_bar{
            background: #fff;
            padding: 10px 15px;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            span{
                font-size: 0.8rem;
                font-weight: 500;
                color: #4abced;
            }
        }
        .body{
            height: calc(100% - 51px);
            .el-row{
                width: 100%;
                height: 100%;
                margin: 0px !important;
                .el-col{
                    height: inherit;
                }
            }
            &-right{
                display: flex;
                flex-direction: column;
                height: inherit;
                &-top{
                    height: 50%;
                    margin-bottom: 5px;
                    .el-col{
                        padding: 0 !important;
                        &:nth-child(1){
                            margin: 0 10px 0 10px;
                        }
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
                    .data-content {
                        width: 100%;
                        background: #fff;
                        height: 100%;
                        #soe,#category{
                            height: 345px;
                        }
                    }
                }
                &-bottom{
                    height: 50%;
                }
            }
        }
    }
</style>