<template>
    <div>
        <div class="magicList" v-if="magicData&&magicData.bat">
            <el-row :gutter="20">
                <el-col :span="6" v-for="(value,name) in magicData" :key="name" :xs="12">
                    <div >
                        <Gauge 
                            :value="{
                                name,
                                value:value.value,
                                createTime:value.createTime
                            }"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>
        <Empty text="无设备" v-else/>
        <el-divider content-position="left">魔节历史数据</el-divider>
        <div>
            <div class="seletGroup">
                <el-form label-position="top">
                    <el-form-item label="环境变量:">
                        <el-select v-model="value" @change="changeParam">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间段:">
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            @change="changeDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下载:">
                        <i class="el-icon-download"></i>
                    </el-form-item>
                </el-form>
            </div>
            <LineChart
                id="MagicLine"
                :value="currentValue"
                :timeArray="timeArray"
            />
        </div>
    </div>
</template>

<script>
    import {Gauge,LineChart} from '@/components/Charts'
    import { filterData } from '@/utils/methods'
    import Empty from '@/components/Empty'
    import { mapActions } from 'vuex'

    export default {
        components: {
            Gauge,
            LineChart,
            Empty
        },
        props: {
            magicData: {
                type: Object,
                default: ()=>{}
            },
            assetType: Number,
        },
        data() {
            return {
                options: [
                        {value: "temp",name: '环境温度'}, 
                        {value: "hum",name: '环境湿度'}, 
                        {value: "o2",name: '氧气含量'}, 
                        {value: "h2s",name: '硫化氢'}, 
                        {value: "co",name: '一氧化碳'}, 
                        {value: "ch4",name: '烷类'}, 
                        {value: "o3",name: '臭氧'}, 
                        {value: "bat",name: '电池电压'}
                    ],
                value: "temp",
                time: [
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), 
                    this.$moment().format('YYYY-MM-DD')
                ],
                allData:[],
                timeArray:[],
                currentValue:[]
            }
        },
        created () {
            this.getMagicHistory();
        },
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        
        methods: {
            ...mapActions('equip',[
                'getMagicHistoryData'
            ]),
            //获取魔节历史数据
            async getMagicHistory(){
                const startTime = this.time[0];
                const endTime = this.time[1];
                await this.getMagicHistoryData({
                    assetId:this.assetObj.id,
                    assetType:this.assetType,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    const {deviceInfoList,dataMap} = res;
                    const names = deviceInfoList.reduce((pre,current)=>{
                        pre[current.deviceAdress] = current.name;
                        return pre
                    },{})
                    //获取数据集合
                    const object = {
                        "temp":[],
                        "hum":[],
                        "o2":[],
                        "co":[],
                        "h2s":[],
                        "o3":[],
                        "ch4":[],
                        "bat":[]
                    }   
                    const {result,timeResult} = filterData({object,names,data:dataMap});
                    this.allData = result;
                    this.timeArray = timeResult;
                    this.currentValue = result[this.value];
                })
            },
            //切换变量
            changeParam(val){
                this.currentValue = this.allData[val];
            },
            //切换日期
            changeDate(date){
                this.time = [date[0],date[1]];
                this.getMagicHistory();
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>