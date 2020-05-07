<template>
    <div class="RING_VIEW">
        <el-row :gutter="30" >
            <!-- 魔戒视图 -->
            <el-col :span="10" :xs="24">
                <div class="view">
                    <ul class="wrap">
                        <li class="top_branch">
                            <span class="top_branch_title">{{title}}</span>
                        </li>
                        <li v-for="(item,index) in switchList" :key="item.switchId" class="branch">
                            <div class="title">
                                <span 
                                    @click="selectOutLine(index,item)" 
                                    :class="highlight===index&&'active'"
                                >
                                    {{item.switchName}}
                                </span>
                            </div>
                            <ul 
                                class="list" 
                                :style="{
                                    backgroundImage:`url(${linemap})`,
                                    backgroundRepeat: 'no-repeat'
                                }"
                            >
                                <li v-for="k in item.outLineList" :key="k.deviceId">
                                    <div class="info">
                                        <el-tooltip effect="dark" :content="`${k.deviceName}` || 'null'" placement="right">
                                            <svg-icon 
                                                iconClass="ring" 
                                                className="icon"
                                            />
                                        </el-tooltip>
                                        <span class="temp">{{(k.data && k.data.decodeHex.lineTemp)||'----'}} ℃</span>
                                        <span class="lineA">{{(k.data && k.data.decodeHex.lineA)||'----'}} A</span>
                                        <span 
                                            :style="{color:k.data&&k.data.decodeHex.soe==='0010'?'red':''}"
                                        >
                                            {{k.data&&k.data.decodeHex.soe==='0010'?'失压':'有压'}}
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
                                <el-form-item label="下载 :" v-if="hasExport">
                                    <i class="el-icon-download" @click="download"></i>
                                </el-form-item>
                            </el-form>
                        </div>
                        <LineChart 
                            :text="`${ringName} (电流曲线图)`" 
                            id="keyA"
                            ref="lineAChart"
                            :value="lineAData"
                            :timeArray="timeArray"
                        />
                        <LineChart 
                            :text="`${ringName} (温度曲线图)`" 
                            id="keyT"
                            ref="tempChart"
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
    import { downFile, timeDiff } from '@/utils/methods'
    import { LineChart } from '@/components/Charts'

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
                hasExport:true,
                linemap:require('@images/linemap.png')
            }
        },
        mounted () {
            const {id, name, hasExport} = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;
            this.hasExport = hasExport;
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
                if(this.currentRing.switchId === item.switchId) return;
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
                //echarts加载Loading
                const lineAChart = this.$refs.lineAChart&&this.$refs.lineAChart.chart;
                const tempChart = this.$refs.tempChart&&this.$refs.tempChart.chart;
                lineAChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });
                tempChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });

                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getRingHistoryData({
                    queryId:this.switchId,
                    startTime,
                    endTime
                }).then(res=>{
                    //echart关闭Loading
                    lineAChart.hideLoading();
                    tempChart.hideLoading();

                    const { history } = res;
                    if( !res || !history )return;
                    const diffTime = timeDiff( startTime, endTime );
                    let timeArray = [];
                    const result = this.currentRing.outLineList && this.currentRing.outLineList.reduce((pre,current)=>{
                        const { outLineId, outLineName } = current;
                        const filtered = history.filter(item=>item.outLineId == outLineId)[0];
                        const currentData = filtered && filtered.dataList;
                        if(!currentData) return pre;
                        let obj = {};
                        currentData.forEach(single=>{
                            const { createTime, dataJSON } = single;
                            timeArray.push(this.$moment(createTime).valueOf());
                            for(let item in dataJSON){
                                if(!obj[item]) obj[item] = [];
                                obj[item].push([this.$moment(createTime).format(diffTime), dataJSON[item]]);
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
                    this.tempData = result['lineTemp'] || [];
                })
            },
            //下载
            download: _.throttle(function(){
                if(!this.switchList.length || !this.timeArray.length ) return;
                const startTime = this.time[0];
                const endTime = this.time[1];
                const msg = this.$message({
                    iconClass:"el-icon-loading",
                    dangerouslyUseHTMLString: true,
                    message:`<strong class="loadingMsg">历史数据下载中...</strong>`,
                    duration:0
                });
                this.getRingHistoryExecl({
                    queryId:this.switchId,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    msg.close();
                    downFile(res);
                })
            },5000)
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .RING_VIEW{
            .el-col{
                height: auto !important;
                margin-bottom: 20px;
            }
        }
    }

    .RING_VIEW{
        height: 100%;
        .el-row{
            height: 100%;
            .el-col{
                height: 100%;
                .view{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .wrap{
                        padding: 0;
                        margin: 0;
                        min-width: 80%;
                        overflow: auto;
                        .top_branch{
                            position: relative;
                            height: 100px;
                            &_title{
                                position: absolute;
                                // width: 220px;
                                left: 110px;
                                top:4px;
                                padding: 5px;
                                font-size: 0.8rem;
                                border-radius: 5px;
                                border: 4px solid black;
                            }
                        }
                        .branch{
                            display: flex;
                            height: 120px;
                            .title{
                                    // width: 30%;
                                    padding: 15px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    span{
                                        font-size: 0.8rem;
                                        font-weight: bold;
                                        cursor: pointer;
                                        padding: 5px 10px;
                                        display: inline-block;
                                        border-radius: 5px;
                                        text-align: center;
                                        width: 110px;
                                    }
                                    .active{
                                        color: #fff;
                                        background-color: rgb(54, 169, 225);
                                    }
                            }
                            .list{
                                flex: 1;
                                position: relative;
                                &::before{
                                        content: ' ';
                                        position: absolute;
                                        top: -60px;
                                        left: 0px;
                                        height: 100%;
                                        border-left: 4px solid #000;
                                }
                                li{
                                    font-size: 0.75rem;
                                    position: relative;
                                    height: 26.5px;
                                    width: 300px;
                                    .info{
                                        position: absolute;
                                        top: 5px;
                                        left: 90px;
                                        display: flex;
                                        align-items: center;
                                        .icon{
                                            width: 20px;
                                            height: 19px;
                                            cursor: pointer;
                                        }
                                        .temp,.lineA{
                                            min-width: 60px;
                                        }
                                        span{
                                            text-align: center;
                                            &:last-child{
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .DATA_DETAIL{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 10px 0;
                    .wrap{
                        width: 98%;
                        #line{
                            height: 300px !important;
                        }  
                        .seletGroup{
                            padding-bottom: 20px;
                            .el-form{
                                .el-form-item{
                                    margin-bottom: 0px;
                                }
                            }
                            .el-icon-download{
                                padding: 10px;
                                cursor: pointer;
                                background: #ecefef;
                                border-radius: 5px;
                            }
                        }
                    }
                    .lineChart{
                        height: 305px;
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }
</style>