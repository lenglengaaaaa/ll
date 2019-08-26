<template>
    <div>
        <div class="magicList">
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
    import { mapActions } from 'vuex'

    export default {
        components: {
            Gauge,
            LineChart
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
                time: [this.$moment().subtract(6, 'days'), new Date()],
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
            getMagicHistory(){
                const startTime = this.$moment(this.time[0]).format("YYYY-MM-DD");
                const endTime = this.$moment(this.time[1]).format("YYYY-MM-DD");
                this.getMagicHistoryData({
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
                        "temp":[],
                        "hum":[],
                        "o2":[],
                        "co":[],
                        "h2s":[],
                        "o3":[],
                        "ch4":[],
                        "bat":[]
                    }   
                    let timeArray= [];
                    for(let i in dataMap){
                        const name = names[i];
                        const keys= Object.keys(result);
                        let obj = {
                            temp:[],
                            hum:[],
                            o2:[],
                            co:[],
                            h2s:[],
                            o3:[],
                            ch4:[],
                            bat:[],
                        }
                        dataMap[i].forEach(item=>{
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
                this.getMagicHistory();
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>