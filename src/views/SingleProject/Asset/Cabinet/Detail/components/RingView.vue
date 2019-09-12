<template>
    <div class="RING_VIEW">
        <el-row :gutter="20" >
            <!-- 魔戒视图 -->
            <el-col :span="10" :xs="24">
                <div class="view">
                    <ul class="wrap">
                        <strong>{{title}}</strong>
                        <li v-for="(item,index) in switchList" :key="item.switchId">
                            <div class="title">
                                <span 
                                    @click="selectOutLine(index,item)" 
                                    :class="highlight===index&&'active'"
                                >
                                    {{item.switchName}}
                                </span>
                            </div>
                            <ul class="list">
                                <li v-for="k in item.outLineList" :key="k.deviceId">
                                    <div class="info">
                                        <el-tooltip class="item" effect="dark" :content="`${k.deviceName}` || 'null'" placement="right">
                                            <svg class="icon" aria-hidden="true" >
                                                <use xlink:href="#icon-ring" ></use>
                                            </svg>
                                        </el-tooltip>
                                        <span>{{(k.data&&k.data.dataJSON.temp)||'----'}} ℃</span>
                                        <span>{{(k.data&&k.data.dataJSON.lineA)||'----'}} A</span>
                                        <span 
                                            :style="{color:k.data&&k.data.dataJSON.soe==='0010'?'red':''}"
                                        >
                                            {{k.data&&k.data.dataJSON.soe==='0010'?'失压':'有压'}}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </el-col>
            <!-- 历史数据 -->
            <el-col :span="14" :xs="24">
                <div class="DATA_DETAIL">
                    <div class="wrap">
                        <div class="seletGroup">
                            <el-form label-position="left" :inline="true">
                                <el-form-item label="时间段 :">
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
                                <el-form-item label="下载 :">
                                    <i class="el-icon-download"></i>
                                </el-form-item>
                            </el-form>
                        </div>
                        <LineChart 
                            :text="`${ringName} (电流曲线图)`" 
                            id="keyA"
                            :value="lineAData"
                            :timeArray="timeArray"
                        />
                        <LineChart 
                            :text="`${ringName} (温度曲线图)`" 
                            id="keyT"
                            :value="tempData"
                            :timeArray="timeArray"
                        />
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {LineChart} from '@/components/Charts'

    export default {
        components: {
            LineChart
        },
        props: {
            switchList: Array
        },
        data() {
            return {
                title:'',
                ringName:'',
                highlight: 0,
                currentRing:{},
                time: [
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), 
                    this.$moment().format('YYYY-MM-DD')
                ],
                timeArray:[],
                lineAData:[],
                tempData:[],
            }
        },
        async mounted () {
            const {id,name} = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;
        },
        watch: {
            switchList(arr) {
                this.currentRing = arr.length && arr[0];
                this.ringName = arr.length && arr[0].switchName;
                const switchId = this.currentRing.switchId ;
                this.getRingHistory(switchId);
            }
        },
        methods: {
            ...mapActions('equip',[
                'getRingHistoryData'
            ]),
            //选中出线
            selectOutLine(index,item) {
                this.highlight = index;
                this.ringName = item.switchName;
                this.currentRing = item;
                this.getRingHistory(item.switchId);
            },
            //切换日期
            changeDate(date){
                this.time = [date[0],date[1]];
                this.getRingHistory(this.currentRing.switchId);
            },
            //获取历史数据
            getRingHistory(id){
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getRingHistoryData({
                    queryId:id,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    const {history} = res;
                    const names = this.currentRing.outLineList&&this.currentRing.outLineList.reduce((pre,current)=>{
                        pre[current.outLineId] = current.outLineName;
                        return pre
                    },{})
                   //获取数据集合
                    const result = {
                        "temp":[],
                        "lineA":[],
                    }   
                    let timeArray= [];
                    for(let i in history){
                        const name = `相序${names[i]}`;
                        const keys= Object.keys(result);
                        let obj = { temp:[], lineA:[] };
                        history[i].forEach(item=>{
                            timeArray.push(new Date(item.createTime).getTime());
                            for(let k of keys){ obj[k].push([this.$moment(item.createTime).format("MM-DD HH:mm:ss"),item.dataJSON[k]]) };
                        })
                        for(let k of keys){ result[k].push({name,data:obj[k]}) };
                    }
                    const timeResult = timeArray.sort().map(item=>this.$moment(item).format("MM-DD HH:mm:ss"));
                    this.timeArray = timeResult;
                    this.lineAData = result['lineA'];
                    this.tempData = result['temp'];
                })
            }

        },
    }
</script>

<style lang="scss" scoped>
    @import '@/styles/ringView.scss';
</style>