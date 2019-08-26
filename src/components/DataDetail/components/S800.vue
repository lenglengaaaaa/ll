<template>
    <div class="s800">
        <el-divider content-position="left">S800传感器平台实时数据</el-divider>
        <div>
            <el-row :gutter="20">
                <el-col :span="8" :xs="24" v-for="(item,d) in sEightData" :key="d">
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
                        type="daterange"
                        range-separator="至"
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
            id="S800"
            :value="currentValue"
            :timeArray="timeArray"
        />
    </div>
</template>

<script>
    import {LineChart} from '@/components/Charts'
    import { mapActions } from 'vuex'

    export default {
        components: {
            LineChart,
        },
        props: {
            sEightData: Array,
            assetType: Number,
        },
        data() {
            return {
                options: [
                        {value: 'co',label: '一氧化碳'}, 
                        {value: 'infrared',label: '红外数据'}, 
                        {value: 'liquid',label: '液位数据'}, 
                        {value: 'batteryA',label: '电池电压'}, 
                        {value: 'shake',label: '震动数据'}, 
                        {value: 'node433',label: '433M节点参数'}, 
                        {value: 'signal',label: '信号强度'}, 
                        {value: 'cbtemp',label: '板子自身温度'}
                    ],
                value: 'co',
                time: [this.$moment().subtract(6, 'days'), new Date()],
                allData:[],
                timeArray:[],
                currentValue:[],
            }
        },
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        created () {
            this.getS800History();
        },
        methods: {
            ...mapActions('equip',[
                'gets800HistoryData' 
            ]),
            //获取线缆历史数据
            getS800History(){
                const startTime = this.$moment(this.time[0]).format("YYYY-MM-DD");
                const endTime = this.$moment(this.time[1]).format("YYYY-MM-DD");
                this.gets800HistoryData({
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
                    const result = {
                        "co":[],
                        "infrared":[],
                        "liquid":[],
                        "batteryA":[],
                        "shake":[],
                        "node433":[],
                        "signal":[],
                        "cbtemp":[]
                    }   
                    let timeArray= [];
                    for(let i in dataMap){
                        const name = names[i];
                        const keys= Object.keys(result);
                        let obj = {
                            "co":[],
                            "infrared":[],
                            "liquid":[],
                            "batteryA":[],
                            "shake":[],
                            "node433":[],
                            "signal":[],
                            "cbtemp":[]
                        }
                        dataMap[i].forEach(item=>{
                            timeArray.push(new Date(item.createTime).getTime());
                            for(let k of keys){ obj[k].push([this.$moment(item.createTime).format("MM-DD HH:mm"),item[k]]) };
                        })
                        for(let k of keys){ result[k].push({name,data:obj[k]}) };
                    }
                    this.timeArray = timeArray.sort().map(item=>this.$moment(item).format("MM-DD HH:mm"));;
                    this.allData = result;
                    this.currentValue = result[this.value];
                })
            },
            //切换变量
            changeParam(val){
                this.currentValue = this.allData[val];
            },
            //切换日期
            changeDate(date){
                this.time = [new Date(date[0]),new Date(date[1])];
                this.getS800History();
            },
            //匹配名称&单位
            match(name,flag){
                let design;
                let unit;
                switch (name) {
                    case 'co':
                        design = "一氧化碳";
                        unit = "%"
                        break;
                    case 'infrared':
                        design = "红外数据";
                        unit = ""
                        break;
                    case 'liquid':
                        design = "液位数据";
                        unit = ""
                        break;
                    case 'batteryA':
                        design = "电池电压";
                        unit = "V"
                        break;
                    case 'shake':
                        design = "震动数据";
                        unit = ""
                        break;
                    case 'node433':
                        design = "433M子节点参数更新状态";
                        unit = ""
                        break;
                    case 'signal':
                        design = "信号强度";
                        unit = "dbm"
                        break;
                    case 'cbtemp':
                        design = "板子自身温度";
                        unit = "℃"
                        break;
                    default:
                        break;
                }
                if(flag) return design;
                return unit
            },
            //获取数据状态
            getStatus(name,value){
                let status;
                switch (name) {
                    case 'infrared':
                        value.value==0?status='正常':status='有人'
                        break;
                    case 'liquid':
                        value.value==0?status='正常':status='进水'
                        break;
                    case 'shake':
                        value.value==1?status='震动':status='静止'
                        break;
                    case 'node433':
                        value.value==1?status='成功':status='失败'
                        break;
                    default:
                        status = value.value
                        break;
                }
                return status;
            },
            //infrared & liquid :0正常 ,1异常
            //shake : 1异常 2正常
            //node433 :1正常 ,2异常
            renderColor(name,value){
                const arr = ['infrared','liquid','shake','node433'];
                if(!arr.includes(name))return'';
                if(name==='infrared'||name==='liquid'||name==='shake'){
                    if(value.value==1) return '#f56c6c';
                }
                if(name==='node433'){
                    if(value.value==2) return '#f56c6c';
                }
            }
        },
    }
</script>

<style lang="scss">
    .s800{
        .box-card{
            margin-bottom: 20px;
            .header{
                div{
                    font-size: 1rem;
                    padding: 5px 0;
                    font-weight: bolder;
                }
                span{
                    font-size: 0.65rem;
                }
            }
            .el-card__body{
                padding: 10px 20px;
            }
            .text{
                font-size: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                & > span{
                    padding: 5px 0;
                }
            }
        }
    }
    
</style>