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
                :value="currentValue"
                :timeArray="timeArray"
            />
        </div>
    </div>
</template>

<script>
    import {Gauge,LineChart} from '@/components/Charts'
    import { newFilterData , downFile} from '@/utils/methods'
    import { mapActions } from 'vuex'

    export default {
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
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                allData:[],
                timeArray:[],
                currentValue:[],
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
                'getMagicHistoryData',
                'getMagicHistoryExecl'
            ]),
            //获取魔节历史数据
            async getMagicHistory(){
                const {id,trapId} = this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                await this.getMagicHistoryData({
                    assetId:trapId||id,
                    assetType:this.assetType,
                    startTime,
                    endTime
                }).then(res=>{
                    const {deviceInfoList,dataMap} = res;
                    if( !res|| !deviceInfoList.length )return;
                    const {result,timeResult} = newFilterData({list:deviceInfoList,data:dataMap});
                    this.allData = result;
                    this.timeArray = timeResult;
                    this.currentValue = result[this.value] || [];
                })
            },
            //下载
            download: _.throttle(function(){
                if((this.magicData&&!this.magicData.bat) || !this.timeArray.length ) return;
                const {id,trapId} = this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getMagicHistoryExecl({
                    assetId:trapId||id,
                    assetType:this.assetType,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    downFile(res);
                })
            },5000),
            //切换变量
            changeParam(val){
                this.currentValue = this.allData[val] || [];
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