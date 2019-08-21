<template>
    <div>
        <div>
            <el-row :gutter="20" type="flex" >
                <el-col :span="12" :xs="24">
                    <div class="data-content" >
                        <SoeChart
                            v-if="soeCount.length"
                            :soeCount="soeCount"
                        />
                        <Empty v-else/>
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="data-content" >
                        <CategoryChart
                            v-if="equipList.length" 
                            :equipList="equipList"
                        />
                        <Empty v-else/>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix"  >
                    <span>设备地图</span>
                </div>
                <div>
                    <Map 
                        vid="apply"
                        :zoom="14"
                    />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import { SoeChart , CategoryChart} from '@/components/Charts'
    import Empty from '@/components/Empty'
    import {Map} from '@/components/Maps'
    import { mapActions } from 'vuex'
    
    export default {
        components: {
            SoeChart,
            CategoryChart,
            Empty,
            Map
        },
        data() {
            return {
                equipList:[],
                soeCount:[]
            }
        },
        mounted () {
            this.getCount();
            this.getSoe()
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            ...mapActions('overall',[
                'getEquipCount',
                'getSoeCount'
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
                let startTime = moment().startOf('year').format('YYYY-MM-DD');
                let endTime = moment().endOf('year').endOf('year').format('YYYY-MM-DD');
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
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .el-row{
                flex-direction: column;
        }
    }
    .el-row {
        margin-bottom: 20px;
        .data-content {
                padding: 30px 0px;
                background: #fff;
                margin-bottom: 20px;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                height: 400px;
            }
    }
    .box-card{
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
    }
</style>