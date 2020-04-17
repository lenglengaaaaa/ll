<template>
    <div class="s800">
        <el-divider content-position="left">红外、烟雾、液位等实时数据</el-divider>
        <div v-if="sensorData&&sensorData.length">
            <el-row :gutter="20">
                <el-col :span="8" :xs="24" v-for="(item,d) in sensorData" :key="d">
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
        <el-divider content-position="left">红外、烟雾、液位等历史数据</el-divider>
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
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="下载:">
                    <i class="el-icon-download" @click="download"></i>
                </el-form-item>
            </el-form>
        </div>
        <LineChart
            id="sensor"
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
            sensorData: Array,
            sensorType:String
        },
        mixins:[SensorMixin,Throttle],
        data() {
            return {
                sign: 'Sensor'
            }
        },
        watch: {
            sensorType( type ) {
                console.log(type,'type')
                this.getSensorHistory(type);
            }
        },
        mounted(){
            this.getSensorHistory('801');
        },
        methods: {
            //获取独立传感器历史数据
            getSensorHistory(type){
                //echarts加载Loading
                const lineChart = this.$refs.lineChart&&this.$refs.lineChart.chart;
                lineChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });

                const {id,trapId} = this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                const func = {
                    '801':this.getS801HistoryData,
                    '803':this.getS803HistoryData,
                    '805':this.getS805HistoryData
                }
                
                func[type]({
                    assetId:trapId||id,
                    assetType:this.assetType,
                    startTime,
                    endTime,
                    key:this.value
                }).then(res=>{
                    //echart关闭Loading
                    lineChart.hideLoading();
                    const { deviceInfoList, dataMap } = res;
                    if( !res || !deviceInfoList.length ){
                        this.timeArray = [];
                        this.currentValue = [];
                        return;
                    };
                    const { result, timeResult } = lastDataFilter({list:deviceInfoList,data:dataMap,type:'sensor',startTime,endTime})
                    this.timeArray = timeResult;
                    this.currentValue = result;
                })

            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [date[0],date[1]];
                this.getSensorHistory();
            },
             //切换环境变量
            changeParam(val){
                this.value = val;
                this.getSensorHistory(this.sensorType);
            },
        },
    }
</script>

<style lang="scss" scope>
    @import '@styles/s800.scss';
</style>