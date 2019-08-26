<template>
    <div>
        <el-divider content-position="left">线缆实时数据</el-divider>
        <div>
            <el-row :gutter="40">
                <el-col :span="12" :xs="24" v-for="(item,d) in lineData" :key="d">
                    <div class="info">
                        <el-popover
                            placement="bottom"
                            width="200"
                            trigger="click"
                        >
                            <div class="pop">
                                <span v-for="(value,key) in item.data" :key="key">
                                    <span>{{match(key,true)}} : </span>
                                    <strong>
                                        {{value.value?key==='shake'?value.value==1?'震动':'静止':value.value:'xx'}}
                                        {{match(key)}}
                                    </strong>
                                </span>
                            </div>
                            <el-link type="primary" slot="reference">{{item.name}}</el-link>
                        </el-popover>
                        <strong class="msg">
                            线缆温度:<span>{{item.data.lineTemp.value || '未知'}}</span>℃ &nbsp;&nbsp;
                            <!-- 1震动 2静止 -->
                            震动:
                            <span 
                                :style="{'color':item.data.shake.value==1&&'#f56c6c'}"
                            >
                                {{item.data.shake.value?item.data.shake.value==1?'震动':'静止':'未知'}}
                            </span>
                        </strong>
                        <span class="time">
                            数据上传时间 : <strong>{{item.createTime || '未知'}}</strong>
                        </span>
                        <el-progress 
                            :percentage="Math.ceil(item.data.lineTemp.value) || 0" 
                            :color="customColors" 
                            :show-text="false"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-divider content-position="left">线缆历史数据</el-divider>
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
            id="line"
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
            lineData: Array
        },
        data() {
            return {
                options: [
                        {value: 'lineTemp',label: '线缆温度'}, 
                        {value: 'lineA',label: '线缆电流'}, 
                        {value: 'lineV',label: '线缆电压'}, 
                        {value: 'batteryA',label: '电池电压'}, 
                        {value: 'cbtemp',label: '板子自身温度'}, 
                        {value: 'shake',label: '震动数据'}, 
                        {value: 'node433',label: '433M子节点参数'}, 
                        {value: 'signal',label: '信号强度'}
                    ],
                value: 'lineTemp',
                time: [this.$moment().subtract(6, 'days'), new Date()],
                allData:[],
                timeArray:[],
                currentValue:[],
                customColors: [
                    {color: '#67c23a', percentage: 90},
                    {color: '#f56c6c', percentage: 100}
                ]
            }
        },
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        created () {
            this.getLineHistory();
        },
        methods: {
            ...mapActions('equip',[
                'getTrapLineHistory' 
            ]),
            //获取线缆历史数据
            getLineHistory(){
                const startTime = this.$moment(this.time[0]).format("YYYY-MM-DD");
                const endTime = this.$moment(this.time[1]).format("YYYY-MM-DD");
                this.getTrapLineHistory({
                    queryId:this.assetObj.id,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    const {lineInfoList,lineDateMap} = res;

                    const names = lineInfoList.reduce((pre,current)=>{
                        pre[current.id] = current.name;
                        return pre
                    },{})
                    //获取数据集合
                    const result = {
                        "cbtemp":[],
                        "batteryA":[],
                        "lineA":[],
                        "lineTemp":[],
                        "lineV":[],
                        "node433":[],
                        "shake":[],
                        "signal":[]
                    }   
                    let timeArray= [];
                    for(let i in lineDateMap){
                        const name = names[i];
                        const keys= Object.keys(result);
                        let obj = {
                            cbtemp:[],
                            batteryA:[],
                            lineA:[],
                            lineTemp:[],
                            lineV:[],
                            node433:[],
                            shake:[],
                            signal:[],
                        }
                        lineDateMap[i].forEach(item=>{
                            timeArray.push(new Date(item.createTime).getTime());
                            for(let k of keys){ obj[k].push([this.$moment(item.createTime).format("MM-DD HH:mm"),item[k]]) };
                        })
                        for(let k of keys){ result[k].push({name,data:obj[k]}) };
                    }
                    const timeResult = timeArray.sort().map(item=>this.$moment(item).format("MM-DD HH:mm"));
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
                this.time = [new Date(date[0]),new Date(date[1])];
                this.getLineHistory();
            },
            //匹配名称&单位
            match(name,flag){
                let design;
                let unit;
                switch (name) {
                    case 'lineTemp':
                        design = "线缆温度";
                        unit = "℃"
                        break;
                    case 'lineA':
                        design = "线缆电流";
                        unit = "A"
                        break;
                    case 'lineV':
                        design = "线缆电压";
                        unit = "V"
                        break;
                    case 'batteryA':
                        design = "电池电压";
                        unit = "V"
                        break;
                    case 'cbtemp':
                        design = "板子自身温度";
                        unit = "℃"
                        break;
                    case 'shake':
                        design = "震动数据";
                        unit = ""
                        break;
                    case 'node433':
                        design = "433M子节点参数";
                        unit = "Mhz"
                        break;
                    case 'signal':
                        design = "信号强度";
                        unit = "dbm"
                        break;
                    default:
                        break;
                }
                if(flag){
                    return design;
                }
                return unit
            }
        },
    }
</script>

<style lang="scss" scoped>
    .info{
        padding-bottom: 50px;
        position: relative;
        .msg{
            position: absolute;
            right: 0;
            font-size: 14px;
            top: 5px;
            span{
                color: #22a7f0;
            }
        }
        .time{
            position: absolute;
            right: 0;
            top: 38px;
            font-size: 13px;
        }
    }
    .pop{
        display: flex;
        flex-direction: column;
        align-items: center;
        & > span{
            padding: 5px 0;
        }
    }
</style>