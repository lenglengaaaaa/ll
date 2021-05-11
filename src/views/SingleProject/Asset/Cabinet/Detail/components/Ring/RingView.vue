<template>
    <div class="RING_VIEW">
        <template v-if="projectId != 56">
            <el-row :gutter="30" >
                <!-- 魔戒视图 -->
                <el-col :span="10" :xs="24">
                    <div 
                        class="view"
                        v-loading="switchLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                    >
                        <ul class="wrap" >
                            <li class="top_branch" v-show="!switchLoading">
                                <span class="top_branch_title">{{title}}</span>
                            </li>
                            <li v-for="(item,index) in switchList" :key="item.switchId" class="branch">
                                <div class="title">
                                    <el-tooltip effect="dark" :content="item.switchAddress" placement="bottom">
                                        <span 
                                            @click="selectOutLine(index,item)" 
                                            :class="highlight===index&&'active'"
                                        >
                                            {{item.switchName}}
                                        </span>
                                    </el-tooltip>
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
                                            <span class="temp">
                                                {{ k.data ? k.data.decodeHex.lineTemp : '----' }} ℃
                                            </span>
                                            <span class="lineA">
                                                {{ (k.data && `${k.data.decodeHex.lineA}`)||'----' }} A
                                            </span>
                                            <!-- N相不判断有压、失压 -->
                                            <!-- projectId为50,贵阳项目临行调整 07-15 -->
                                            <span 
                                                :style="{
                                                    color:
                                                    projectId == 50? '' :
                                                    k.data && k.outLineName !== 'N' && k.data.decodeHex.lineV == '0'?'red':''
                                                }"
                                            >   
                                                {{ judgeVoltage(k) }}
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
                                            :disabled="loading"
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
                                unit="lineA"
                            />
                            <LineChart 
                                :text="`${ringName} (温度曲线图)`" 
                                id="keyT"
                                ref="tempChart"
                                :value="tempData"
                                :timeArray="timeArray"
                                unit="temp"
                            />
                            <!-- <DoubleLineChart
                                :text="ringName" 
                                :value="all_data"
                                ref="doubleLine"
                            /> -->
                        </div>
                    </div>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <div 
                class="tempDiv" 
                v-loading="switchLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <el-row :gutter="0">
                    <el-col :span="6">
                        <div class="wrap">
                            <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
                                <el-tab-pane 
                                    v-for="item in switchList"
                                    :key="item.switchId"
                                    :label="item.switchName" 
                                    :name="item.switchAddress"
                                    :test="item"
                                >
                                    <div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <div class="second_layout">
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
                                            :disabled="loading"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                    <!-- <el-form-item label="下载 :" v-if="hasExport">
                                        <i class="el-icon-download" @click="download"></i>
                                    </el-form-item> -->
                                </el-form>
                            </div>
                            <LineChart 
                                :text="`${ringName} (温度曲线图)`" 
                                id="keyT"
                                ref="tempChart"
                                :value="tempData"
                                :timeArray="timeArray"
                                unit="temp"
                            />
                            <LineChart 
                                :text="`${ringName} (电流曲线图)`" 
                                id="keyA"
                                ref="lineAChart"
                                :value="lineAData"
                                :timeArray="timeArray"
                                unit="lineA"
                            />
                            <LineChart 
                                :text="`${ringName} (线损曲线图)`" 
                                id="keyW"
                                ref="wasteChart"
                                :value="wasteData"
                                :timeArray="wasteTimeArray"
                                unit="lineA"
                            />
                        </div>      
                        
                    </el-col>
                </el-row>
            </div>
        </template>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { mapActions } from 'vuex'
    import { downFile, timeDiff } from '@/utils/methods'
    import { LineChart, DoubleLineChart } from '@/components/Charts'

    export default {
        components: {
            LineChart,
            DoubleLineChart
        },
        props: {
            switchList: Array,
            switchLoading:Boolean
        },
        data() {
            return {
                title:'',
                ringName:'',
                switchId:'',
                highlight: 0,
                loading:false,
                currentRing:{},
                time: [
                    this.$moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                timeArray:[],
                lineAData:[],
                tempData:[],
                hasExport:true,
                linemap:require('@images/linemap.png'),
                all_data:{
                    data:{ lineA:[], lineTemp:[] }
                },

                activeName:'',
                wasteData:[],
                wasteTimeArray:[]
            }
        },
        mounted () {
            const { id, name, hasExport } = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;
            this.hasExport = hasExport;
        },
        computed: {
            projectId() {
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        watch: {
            switchList(arr) {
                this.currentRing = arr.length && arr[0];
                this.ringName = arr.length && arr[0].switchName;
                this.switchId = this.currentRing.switchId;
                this.activeName = this.currentRing.switchAddress;
                this.getRingHistory();

                if( this.projectId == 56 ){  // 唐山项目
                    this.getLineLossData();
                }
                
            }
        },
        methods: {
            ...mapActions('equip',[
                'getRingHistoryData',
                'getRingHistoryExecl',
                'getLineLoss'
            ]),
            /**
             * 唐山项目 标签切换事件
             */
            handleClick(e){
                const { index } = e;
                const item = this.switchList[+index];
                if(this.currentRing.switchId === item.switchId) return;
                this.ringName = item.switchName;
                this.switchId = item.switchId;
                this.activeName = item.switchAddress;
                this.currentRing = item;
                this.getRingHistory();
                this.getLineLossData();
            },
            /**
             * 判断有压无压
             * A、B、C向显示为失压
             * N向显示为无压
             */
            judgeVoltage(k){
                if(!k.data) return '----';
                // 贵州项目屏蔽(temp)
                if( this.projectId == 50 ) return "有压";
                if( k.outLineName === 'N' && k.data.decodeHex.lineV == '0') return "无压";
                if( k.data.decodeHex.lineV == '0') return "失压";
                return "有压"
            },
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
                if( this.projectId == 56 ){  // 唐山项目
                    this.getLineLossData();
                }
            },
            //获取历史数据
            getRingHistory(){
                //echarts加载Loading
                const lineAChart = this.$refs.lineAChart && this.$refs.lineAChart.chart;
                const tempChart = this.$refs.tempChart && this.$refs.tempChart.chart;

                lineAChart && lineAChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });
                tempChart && tempChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });

                this.loading = true;

                const startTime = this.time[0];
                const endTime = this.time[1];
                this.getRingHistoryData({
                    queryId:this.switchId,
                    startTime,
                    endTime,
                    deviceType:36
                }).then(res=>{
                    if( res ){
                        //echart关闭Loading
                        this.loading = false;
                        lineAChart && lineAChart.hideLoading();
                        tempChart && tempChart.hideLoading();
                    }
                    const { history } = res;
                    if( !res || !history )return;
                    const diffTime = timeDiff( startTime, endTime );
                    let timeArray = [];
                    const result = this.currentRing.outLineList && this.currentRing.outLineList.reduce((pre,current)=>{
                        const { outLineId, outLineName } = current;
                        const filtered = history.filter(item=>item.outLineId == outLineId)[0];
                        const currentData = filtered && filtered.dataList.length && filtered.dataList;
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
                            pre[k].push({ 
                                name:`${k==='lineA'?'电流':'温度'}${outLineName}`,
                                outLineName,
                                data:obj[k] 
                            });
                        }
                        return pre;
                    },{})

                    this.timeArray = this._.sortBy(timeArray).map(item=>this.$moment(item).format(diffTime));
                    
                    for(let item in result){
                        result[item] = ['A','B','C','N'].map( k =>{
                            const hasItem = result[item].filter(i => i.outLineName === k);
                            if(hasItem.length){
                                return hasItem[0];
                            }else{
                                return {
                                    name:`${item==='lineA'?'电流':'温度'}${k}`,
                                    outLineName:k,
                                    data:[]
                                }
                            }
                        })
                    }           
                    
                    this.lineAData = result['lineA'] || [];
                    this.tempData = result['lineTemp'] || [];
                })
            },
            // 获取线损曲线
            getLineLossData(){
                const wasteChart = this.$refs.wasteChart && this.$refs.wasteChart.chart;
                wasteChart && wasteChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });

                const [ startTime, endTime ] = this.time;

                this.getLineLoss({
                    queryId:this.switchId,
                    startTime,
                    endTime,
                    deviceType:36
                }).then(res=>{
                    if( res ){
                        //echart关闭Loading
                        this.loading = false;
                        wasteChart && wasteChart.hideLoading();
                    }

                    const { history } = res;
                    if( !res || !history ){
                        this.wasteData = [];
                        this.wasteTimeArray = [];
                        return;
                    };
                    const diffTime = timeDiff( startTime, endTime );
                    let timeArray = [];

                    let arr = [];
                    history.forEach(item=>{
                        const { time, waste } = item;
                        timeArray.push(this.$moment(time).valueOf());
                        arr.push([this.$moment(time).format(diffTime), waste])
                    })

                    this.wasteData= [
                        {
                            name: "线损",
                            data:arr
                        }
                    ]
                    this.wasteTimeArray = this._.sortBy(timeArray).map(item=>this.$moment(item).format(diffTime));

                })
            },
            //下载
            download: _.throttle(function(){
                if(!this.switchList.length || !this.timeArray.length ) return;
                const { id } =  JSON.parse(sessionStorage.getItem('obj'));
                const startTime = this.time[0];
                const endTime = this.time[1];
                const msg = this.$message({
                    iconClass:"el-icon-loading",
                    dangerouslyUseHTMLString: true,
                    message:`<strong class="loadingMsg">历史数据下载中...</strong>`,
                    duration:0
                });
                this.getRingHistoryExecl({
                    chestId:id,
                    queryId:this.switchId,
                    startTime,
                    endTime,
                    deviceType:36
                }).then(res=>{
                    if(!res)return;
                    downFile(res);
                })
                .finally(()=>{
                    msg.close()
                })
            },5000)
        },
    }
</script>

<style lang="scss" >
    @import '@styles/ringview.scss';

    .tempDiv{
        .wrap{
            display: flex;
            justify-content: center;
            .el-tabs .el-tabs__content{
                height: 0px !important;
            }
        }
        .second_layout{
            height: 100%;
        }
    }

</style>