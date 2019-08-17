<template>
    <div>
        <div>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24" v-for="(k,i) in 5" :key="i">
                    <div class="info">
                        <el-popover
                            placement="bottom"
                            width="200"
                            trigger="click"
                        >
                            <div class="pop">
                                <span v-for="(i,index) in 5" :key="index">
                                    线缆电压 : <span>0</span>A
                                </span>
                            </div>
                            <el-link type="primary" slot="reference">线缆一</el-link>
                        </el-popover>
                        <strong class="msg">
                            线缆温度:<span>10</span>℃ &nbsp;&nbsp;震动:<span>静止</span>
                        </strong>
                        <el-progress :percentage="50" color="#f56c6c" :show-text="false"></el-progress>
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
            </el-form>
            <div class="icon">
                <i class="el-icon-download"></i>
            </div>
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
        data() {
            return {
                options: [
                        {value: 'lineTemp',label: '线缆温度'}, 
                        {value: 'lineA',label: '线缆电流'}, 
                        {value: 'lineV',label: '线缆电压'}, 
                        {value: 'batteryA',label: '电池低压'}, 
                        {value: 'cbtemp',label: '板子自身温度'}, 
                        {value: 'shake',label: '震动数据'}, 
                        {value: 'node433',label: '433M子节点参数'}, 
                        {value: 'signal',label: '信号强度'}
                    ],
                value: 'lineTemp',
                time: [new Date(), new Date()],
                allData:[],
                timeArray:[],
                currentValue:[]
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
            }
        },
    }
</script>

<style lang="scss" scoped>
    .info{
        padding-bottom: 20px;
        position: relative;
        .msg{
            position: absolute;
            right: 0;
            top: 5px;
            font-size: 14px;
            span{
                color: #f56c6c;
            }
        }
    }
</style>