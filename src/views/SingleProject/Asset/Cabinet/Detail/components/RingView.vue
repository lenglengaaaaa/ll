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
                                            <svg-icon 
                                                iconClass="ring" 
                                                className="icon"
                                            />
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
                                <el-form-item label="下载 :">
                                    <i class="el-icon-download" @click="download"></i>
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
    import _ from 'lodash';
    import { mapActions } from 'vuex'
    import { newFilterData ,downFile,timeDiff } from '@/utils/methods'
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
                switchId:'',
                highlight: 0,
                currentRing:{},
                time: [
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                timeArray:[],
                lineAData:[],
                tempData:[],
            }
        },
        mounted () {
            const {id,name} = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;
        },
        watch: {
            switchList(arr) {
                this.currentRing = arr.length && arr[0];
                this.ringName = arr.length && arr[0].switchName;
                this.switchId = this.currentRing.switchId;
                this.getRingHistory();
            }
        },
        methods: {
            ...mapActions('equip',[
                'getRingHistoryData',
                'getRingHistoryExecl'
            ]),
            //选中出线
            selectOutLine(index,item) {
                this.highlight = index;
                this.ringName = item.switchName;
                this.switchId = item.switchId;
                this.currentRing = item;
                this.getRingHistory();
            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [date[0],date[1]];
                this.getRingHistory();
            },
            //获取历史数据
            getRingHistory(){
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getRingHistoryData({
                    queryId:this.switchId,
                    startTime,
                    endTime
                }).then(res=>{
                    const {history} = res;
                    if( !res )return;
                    const diffTime = timeDiff(startTime,endTime);
                    let timeArray = [];
                    const result = this.currentRing.outLineList&&this.currentRing.outLineList.reduce((pre,current)=>{
                        const {outLineId,outLineName} = current;
                        const currentData = history[outLineId];
                        if(!currentData) return pre;
                        let obj = {};
                        currentData.forEach(single=>{
                            timeArray.push(this.$moment(single.createTime).valueOf());
                            const {dataJSON} = single;
                            for(let item in dataJSON){
                                if(!obj[item]) obj[item] = [];
                                obj[item].push([this.$moment(single.createTime).format(diffTime),dataJSON[item]]);
                            }
                        })
                        for(let k in obj){
                            if(!pre[k]) pre[k] = [];
                            pre[k].push({ name:`相序${outLineName}`,data:obj[k] });
                        }
                        return pre;
                    },{})
                    const timeResult = this._.sortBy(timeArray).map(item=>this.$moment(item).format(diffTime));
                    this.timeArray = timeResult;
                    this.lineAData = result['lineA'] || [];
                    this.tempData = result['temp'] || [];
                })
            },
            //下载
            download: _.throttle(function(){
                if(!this.switchList.length || !this.timeArray.length ) return;
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getRingHistoryExecl({
                    queryId:this.switchId,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    downFile(res);
                })
            },5000)
        },
    }
</script>

<style lang="scss" scoped>
    @import '@styles/ringView.scss';
</style>