<template>
    <div>
        <el-divider content-position="left">线缆实时数据</el-divider>
        <div v-if="lineData&&lineData.length">
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
                            <el-button type="text" slot="reference" class="link">{{item.name}}</el-button>
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
        <cc-empty text="无设备" v-else />
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
            id="line"
            :value="currentValue"
            :timeArray="timeArray"
        />
    </div>
</template>

<script>
    import {LineChart} from '@/components/Charts'
    import {newFilterData,downFile} from '@/utils/methods'
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
                        {value: 'CBTemp',label: '板子自身温度'}, 
                        {value: 'shake',label: '震动数据'}, 
                        {value: 'node433',label: '433M子节点参数'}, 
                        {value: 'signal',label: '信号强度'}
                    ],
                value: 'lineTemp',
                time: [
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                allData:[],
                timeArray:[],
                currentValue:[],
                customColors: [
                    {color: '#67c23a', percentage: 90},
                    {color: '#f56c6c', percentage: 100}
                ],
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
                'getTrapLineHistory',
                'getTrapHistoryExecl'
            ]),
            //获取线缆历史数据
            getLineHistory(){
                const {id,trapId}=this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getTrapLineHistory({
                    queryId:trapId||id,
                    startTime,
                    endTime
                }).then(res=>{
                    const {lineInfoList,lineDateMap} = res;
                    if(!res || !lineInfoList.length)return;
                    const {result,timeResult} = newFilterData({list:lineInfoList,data:lineDateMap,type:'line'});
                    this.allData = result;
                    this.timeArray = timeResult;
                    this.currentValue = result[this.value] || [];
                })
            },
            //下载
            download: _.throttle(function(){
                if(!this.lineData.length || !this.timeArray.length ) return;
                const {id,trapId}=this.assetObj;
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getTrapHistoryExecl({
                    queryId:trapId||id,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    downFile(res)
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
                    case 'CBTemp':
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
            top: 0px;
            span{
                color: #22a7f0;
            }
        }
        .time{
            position: absolute;
            right: 0;
            top:35px;
            font-size: 13px;
        }
        .link{
            padding: 0;
            padding-bottom: 5px;
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