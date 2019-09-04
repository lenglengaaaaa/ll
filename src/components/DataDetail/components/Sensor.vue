<template>
    <div class="s800">
        <el-divider content-position="left">红外、烟雾、液位等实时数据</el-divider>
        <div>
            <el-row :gutter="20">
                <el-col :span="8" :xs="24" v-for="(item,d) in sensorData" :key="d">
                    <el-card class="box-card">
                        <div slot="header" class="header">
                            <div>{{item.name}}</div>
                            <span>
                                数据上传时间 : 
                                <strong>{{item.createTime || '未知'}}</strong>
                            </span>
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
            id="sensor"
            :value="currentValue"
            :timeArray="timeArray"
        />
    </div>
</template>

<script>
    import {filterData} from '@/utils/methods'
    import { mapActions } from 'vuex'
    import SensorMixin from './mixin/Sensor'

    export default {
        props: {
            sensorData: Array,
        },
        mixins:[SensorMixin],
        created () {
            this.getSensorHistory();
        },
        methods: {
            ...mapActions('equip',[
                'getSensorHistoryData' 
            ]),
            //获取线缆历史数据
            getSensorHistory(){
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getSensorHistoryData({
                    assetId:this.assetObj.id,
                    assetType:this.assetType,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    const {deviceInfoList,dataMap} = res;
                    const names = deviceInfoList.reduce((pre,current)=>{
                        pre[current.deviceType] = {};
                        pre[current.deviceType][current.deviceAdress] = current.name;
                        return pre
                    },{})
                    //获取数据集合
                    let result = {
                        "co":[],
                        "infrared":[],
                        "liquid":[],
                        "batteryA":[],
                        "shake":[],
                        "node433":[],
                        "signal":[],
                        "CBTemp":[]
                    }  
                    let timeArray= [];
                    
                    for(let i in dataMap){
                        const item = dataMap[i];
                        for(let k in item){
                            const current = item[k];
                            const name = names[i][k];
                            const keys= Object.keys(result);
                            let temporaryObj = {
                                "co":[],
                                "infrared":[],
                                "liquid":[],
                                "batteryA":[],
                                "shake":[],
                                "node433":[],
                                "signal":[],
                                "CBTemp":[]
                            };
                            current.forEach(val=>{
                                timeArray.push(new Date(val.createTime).getTime());
                                for(let key of keys){ 
                                    temporaryObj[key].push([moment(val.createTime).format("MM-DD HH:mm:ss"),val[key]])
                                };
                            })
                            for(let key of keys){ result[key].push({name,data:temporaryObj[key]}) };
                        }
                    }
                    const timeResult = timeArray.sort().map(item => moment(item).format("MM-DD HH:mm:ss"));
                    this.allData = result;
                    this.timeArray = timeResult;
                    this.currentValue = result[this.value];
                })
            },
            //切换日期
            changeDate(date){
                this.time = [date[0],date[1]];
                this.getSensorHistory();
            },
        },
    }
</script>

<style lang="scss" scope>
    @import '@/styles/s800.scss';
</style>