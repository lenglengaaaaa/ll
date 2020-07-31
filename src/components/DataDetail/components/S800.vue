<template>
    <div class="s800">
        <el-divider content-position="left">S800传感器平台实时数据</el-divider>
        <div v-loading="s800Loading">
            <div v-if="sEightData&&sEightData.length">
                <el-row :gutter="20">
                    <el-col :span="8" :xs="24" v-for="(item,d) in sEightData" :key="d">
                        <el-card class="box-card">
                            <div slot="header" class="header">
                                <div>{{item.name}}</div>
                                <span>设备编号 : <strong>{{item.number || '未知'}}</strong></span>
                                <span>数据上传时间 : <strong>{{item.createTime || '未知'}}</strong></span>
                            </div>
                            <div v-for="(value,key) in item.data" :key="key" class="text">
                                <span>
                                    <span>{{match(key,true)}} : </span>
                                    <strong
                                        :style="{'color':renderColor(key,value)}"
                                    >
                                        {{getStatus(key,value) || 'xx'}}
                                        {{match(key)}}
                                    </strong>
                                </span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <cc-empty text="无设备" v-else />
        </div>
        <el-divider content-position="left">S800传感器平台历史数据</el-divider>
        <div class="seletGroup">
            <el-form label-position="top">
                <el-form-item label="环境变量:">
                    <el-select v-model="value" @change="changeParam">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
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
                        :disabled="loading"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="下载:">
                    <i class="el-icon-download" @click="download"></i>
                </el-form-item>
            </el-form>
        </div>
        <LineChart
            id="S800"
            ref="lineChart"
            :value="currentValue"
            :timeArray="timeArray"
        />
    </div>
</template>

<script>
    import { lastDataFilter } from '@/utils/methods'
    import SensorMixin from './mixin/Sensor'
    import Throttle from './mixin/Throttle'

    export default {
        props: {
            sEightData: Array,
            s800Loading:Boolean
        },
        mixins:[SensorMixin,Throttle],
        data() {
            return {
                loading:false,
                sign: 'S800'
            }
        },
        mounted () {
            this.getS800History();
        },
        methods: {
            //获取线缆历史数据
            getS800History(){
                //echarts加载Loading
                const lineChart = this.$refs.lineChart&&this.$refs.lineChart.chart;
                lineChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)' });
                this.loading = true;

                const {id,trapId}=this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.gets800HistoryData({
                    assetId:trapId||id,
                    assetType:this.assetType,
                    startTime,
                    endTime,
                    key:this.value
                }).then(res=>{
                    //echart关闭Loading
                    lineChart.hideLoading();
                    this.loading = false;
                    
                    const {deviceInfoList,dataMap} = res;
                    if(!res || !deviceInfoList.length)return;
                    const { result, timeResult } = lastDataFilter({
                        list:deviceInfoList,
                        data:dataMap,
                        startTime,
                        endTime
                    })
                    this.timeArray = timeResult;
                    this.currentValue = result;
                })
            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [date[0],date[1]];
                this.getS800History();
            },
            //切换环境变量
            changeParam(val){
                this.value = val;
                this.getS800History();
            },
        },
    }
</script>

<style lang="scss" scope>
    @import '@styles/s800.scss';
</style>