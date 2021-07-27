<template>
    <div class="RING_VIEW">
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
                            <span class="top_branch_title">{{ title }}</span>
                        </li>
                        <li v-for="(item,index) in switchList" :key="item.switchId" class="branch">
                            <div class="title">
                                <el-tooltip effect="dark" :content="item.address" placement="bottom">
                                    <span 
                                        @click="selectOutLine(index,item)" 
                                        :class="highlight===index && 'active'"
                                    >
                                        {{item.name}}
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
                                <li>
                                    <div class="info">
                                        <el-tooltip effect="dark" placement="right">
                                            <svg-icon iconClass="ring" className="icon" />
                                        </el-tooltip>
                                        <span class="temp"> {{ item.ringData.atemperature || '----' }} ℃ </span>
                                        <span class="lineA"> {{ item.ringData.acurrent || '----' }} A </span>
                                        <!-- N相不判断有压、失压 -->
                                        <!-- projectId为50,贵阳项目临行调整 07-15 -->
                                        <span :style="{ color: item.ringData.avoltage == '0'?'red':'' }" > 
                                            {{ item.ringData.avoltage ? item.ringData.avoltage == 0 ? '失压': '有压' : 'xxx' }}  
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="info">
                                        <el-tooltip effect="dark" placement="right">
                                            <svg-icon iconClass="ring" className="icon" />
                                        </el-tooltip>
                                        <span class="temp"> {{ item.ringData.btemperature || '----' }} ℃ </span>
                                        <span class="lineA"> {{ item.ringData.bcurrent || '----' }} A </span>
                                        <!-- N相不判断有压、失压 -->
                                        <!-- projectId为50,贵阳项目临行调整 07-15 -->
                                        <span :style="{ color: item.ringData.bvoltage == '0'?'red':'' }" > 
                                            {{ item.ringData.bvoltage ? item.ringData.bvoltage == 0 ? '失压': '有压' : 'xxx' }}  
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="info">
                                        <el-tooltip effect="dark" placement="right">
                                            <svg-icon iconClass="ring" className="icon" />
                                        </el-tooltip>
                                        <span class="temp"> {{ item.ringData.ctemperature || '----' }} ℃ </span>
                                        <span class="lineA"> {{ item.ringData.ccurrent || '----' }} A </span>
                                        <!-- N相不判断有压、失压 -->
                                        <!-- projectId为50,贵阳项目临行调整 07-15 -->
                                        <span :style="{ color: item.ringData.cvoltage == '0'?'red':'' }" > 
                                            {{ item.ringData.cvoltage ? item.ringData.cvoltage == 0 ? '失压': '有压' : 'xxx' }}  
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="info">
                                        <el-tooltip effect="dark" placement="right">
                                            <svg-icon iconClass="ring" className="icon" />
                                        </el-tooltip>
                                        <span class="temp"> {{ item.ringData.ntemperature || '----' }} ℃ </span>
                                        <span class="lineA"> {{ item.ringData.ncurrent || '----' }} A </span>
                                        <!-- N相不判断有压、失压 -->
                                        <!-- projectId为50,贵阳项目临行调整 07-15 -->
                                        <span :style="{ color: item.ringData.nvoltage == '0'?'red':'' }" > 
                                            {{ item.ringData.nvoltage ? item.ringData.nvoltage == 0 ? '无压': '有压' : 'xxx' }}  
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
                            </el-form>
                        </div>
                        <LineChart 
                            text="电流曲线图" 
                            id="keyA"
                            ref="lineAChart"
                            :value="current_data"
                        />
                        <LineChart 
                            text="温度曲线图" 
                            id="keyT"
                            ref="tempChart"
                            :value="temperature_data"
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
    import { LineChart, DoubleLineChart } from '@/components/Charts'
    import { request } from '@/utils/Request'
    import { api } from '@/utils/API'

    export default {
        components: {
            LineChart,
            DoubleLineChart
        },
        props: {
            switchLoading:Boolean
        },
        data() {
            return {
                switchList:[],
                current_address:"",
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
                current_data:{},
                temperature_data:{},
                linemap:require('@images/linemap.png'),
            }
        },
        mounted () {
            const { name, id } = JSON.parse(sessionStorage.getItem('obj'));
            this.title = name ;

            this.getChestFullTree({
                projectId:this.projectId,
                chestId:id
            }).then(res=>{
                if( !res ) return;
                this.switchList = res.children; 
                if( res.children.length ){
                    const { address } = this.switchList[0];
                    this.current_address = address;
                    this.getLoopHistoryData(address)
                }
            })
        },
        computed: {
            projectId() {
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        methods: {
            ...mapActions('mini',[
                'getChestFullTree'
            ]),
            //选中出线
            selectOutLine(index,item) {
                if(this.current_address === item.address) return;
                this.highlight = index;

                this.current_address = item.address;
                this.getLoopHistoryData(item.address);
            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [ date[0], date[1] ];
                this.getLoopHistoryData(this.current_address);
            },
            /**
             * 获取回路历史数据 post
             * @param String address 回路地址
             * @param Integer projectId 项目ID
             * @param String startTime 起始时间 
             * @param String endTime 结束时间 
             */
            getLoopHistoryData(address){
                const [ startTime, endTime ] = this.time;
                const lineAChart = this.$refs.lineAChart && this.$refs.lineAChart.chart;
                const tempChart = this.$refs.tempChart && this.$refs.tempChart.chart;

                lineAChart && lineAChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });
                tempChart && tempChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)'  });
                this.loading = true;
                

                request({
                    url:api.getLoopHistoryData,
                    method:"post",
                    data:{
                        address,
                        projectId:this.projectId,
                        startTime,
                        endTime
                    }
                }).then(res=>{
                    if( res ){
                        //echart关闭Loading
                        this.loading = false;
                        lineAChart && lineAChart.hideLoading();
                        tempChart && tempChart.hideLoading();
                    }

                    if( res && res.data && res.data.length){
                        const result = res.data.reduce((pre,cur)=>{
                            for(let i in cur){
                                if( pre[i] ){
                                    if( i == "createTime"){
                                        pre["createTime"].push(this.$moment(cur.createTime).format(timeDiff(startTime,endTime)))
                                    }else{
                                        pre[i].push(cur[i]);
                                    }
                                }
                            }
                            return pre;
                        },{
                            acurrent:[], bcurrent:[],ccurrent:[], ncurrent:[],
                            atemperature:[], btemperature:[],ctemperature:[], ntemperature:[],
                            createTime:[]
                        })

                        const { acurrent, bcurrent, ccurrent, ncurrent, atemperature, btemperature,ctemperature, ntemperature, createTime} = result;

                        let current_data = {
                            type:"current",
                            dataArr:[
                                { name: '电流A', type: 'line', data: acurrent },
                                { name: '电流B', type: 'line', data: bcurrent },
                                { name: '电流C', type: 'line', data: ccurrent },
                                { name: '电流N', type: 'line', data: ncurrent }
                            ],
                            timeArr:createTime
                        }

                        let temperature_data = {
                            type:"temperature",
                            dataArr:[
                                { name: '温度A', type: 'line', data: atemperature },
                                { name: '温度B', type: 'line', data: btemperature },
                                { name: '温度C', type: 'line', data: ctemperature },
                                { name: '温度N', type: 'line', data: ntemperature }
                            ],
                            timeArr:createTime
                        }

                        this.current_data = current_data;
                        this.temperature_data = temperature_data;
                    }else{
                        this.current_data = { type:"current", dataArr:[], timeArr:[] };
                        this.temperature_data = { type:"temperature", dataArr:[], timeArr:[] };
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '@styles/ringview.scss';
</style>