<template>
    <div>
        <div v-loading="loading" element-loading-text="拼命加载中">
            <div class="magicList" v-if="magicData&&magicData.bat" >
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
            <cc-empty text="无设备" v-else/>
        </div>
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
                            type="datetimerange"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            @change="changeDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下载:">
                        <i class="el-icon-download" @click="download"></i>
                    </el-form-item>
                </el-form>
            </div>
            <LineChart
                id="MagicLine"
                ref="lineChart"
                :value="currentValue"
                :timeArray="timeArray"
            />
        </div>
    </div>
</template>

<script>
    import { Gauge , LineChart } from '@/components/Charts'
    import { newFilterData } from '@/utils/methods'
    import Throttle from './mixin/Throttle'

    export default {
        mixins:[Throttle],
        components: {
            Gauge,
            LineChart,
        },
        props: {
            magicData: {
                type: Object,
                default: ()=>{}
            },
            assetType: Number,
            loading:Boolean
        },
        data() {
            return {
                sign:'Magic',
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
            }
        },
        mounted () {
            this.getMagicHistory();
        },
        methods: {
            //获取魔节历史数据
            async getMagicHistory(){
                //echarts加载Loading
                const lineChart = this.$refs.lineChart&&this.$refs.lineChart.chart;
                lineChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)' });

                const {id,trapId} = this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                await this.getMagicHistoryData({
                    assetId:trapId||id,
                    assetType:this.assetType,
                    startTime,
                    endTime
                }).then(res=>{
                    //echart关闭Loading
                    lineChart.hideLoading();
                    
                    const {deviceInfoList,dataMap} = res;
                    if( !res|| !deviceInfoList.length )return;
                    const {result,timeResult} = newFilterData({list:deviceInfoList,data:dataMap,startTime,endTime});
                    this.allData = result;
                    this.timeArray = timeResult;
                    this.currentValue = result[this.value] || [];
                    
                })
            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [date[0],date[1]];
                this.getMagicHistory();
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>