<template>
    <div class="Equip_Detail">
        <i 
            class="el-icon-back"
            @click="close"
            v-if="hasClose"
        />
        <div class="wrap">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1">
                    <div class="top">
                        <div class="intro">
                            <div v-for="item in basicMenu" :key="item.id">
                                <strong>{{ item.title }}</strong>
                                <span v-if="item.id != 'onlineStatus'">{{ item.value && alarm_value[item.id]? '': item.value }}</span>
                                <span class="point" :class="alarm_value[item.id] && item.initial_value? 'normal': 'alarm'" v-else />
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="告警信息" name="5">
                    <div class="intro">
                        <div class="alarm_wrap" v-if="warnItem && warnItem.typeName">
                            <div>
                                <strong>告警内容 :</strong>
                                <span>
                                    {{ warnItem.typeName }}{{ noHasDecodeHex(warnItem.typeCode)?'' : warnItem.decodeHex }}
                                </span>
                            </div>
                            <div>
                                <strong>告警时间 :</strong>
                                <span>
                                    {{ warnItem.createTime }}
                                </span>
                            </div>
                        </div>
                        <div class="empty" v-else>
                            <cc-empty text="暂无告警数据" />
                        </div>
                    </div>
                    
                </el-collapse-item>


                <el-collapse-item 
                    title="装置状态" 
                    name="2"
                    v-if="equipObj.type == 40"
                >
                    <div class="center">
                        <div class="intro">
                            <div>
                                <strong>激活状态</strong>
                                <span>
                                    <el-button 
                                        type="primary" 
                                        v-if="pileState.activationState == 2"
                                        @click="updatePileState('activationState')"
                                    >
                                        激活
                                    </el-button>
                                    <span 
                                        :style="{color: pileState.activationState == 1? '#e6a23c': '#67c23a'}"
                                        v-else
                                    >
                                        {{pileState.activationState == 3? "激活中..." : "已激活"}}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <strong>告警状态</strong>
                                <span>
                                    <el-button 
                                        type="primary" 
                                        v-if="pileState.warnState == 1"
                                        @click="updatePileState('warnState')"
                                    >
                                        解除告警
                                    </el-button>
                                    <span 
                                        :style="{color: pileState.warnState == 3? '#67c23a': '#e6a23c'}"
                                        v-else
                                    >
                                        {{pileState.warnState == 2? "解除中..." : "正常"}}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item 
                    title="实时数据" 
                    name="3"
                >
                    <div class="center" >
                        <div class="intro">
                            <div class="realTime_wrap" v-if="realData.dataTime">
                                <div class="dataTime">
                                    数据上传时间 : {{ realData.dataTime }}
                                </div>
                                <div v-for="item in realData.data" :key="item.id">
                                    <strong>{{ item.title }}</strong>
                                    <span :class="alarm_value[item.id]? diffColor(item.id,item.initial_value) :''">
                                        {{item.value}}
                                    </span>
                                </div>
                            </div>
                            <div class="empty" v-else>
                                <cc-empty text="暂无数据" />
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item 
                    title="历史数据" 
                    name="4"
                >
                    <div class="center">
                        <div>
                            <div class="seletGroup">
                                <el-form label-position="top">
                                    <el-form-item label="环境变量:">
                                        <el-select v-model="value" @change="changeParam">
                                            <el-option
                                                v-for="item in columns"
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
                                            :disabled="loading"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <LineChart
                                id="line"
                                ref="lineChart"
                                :value="currentHistoryData"
                            />
                        </div>
                    </div>
                </el-collapse-item>
                <!-- <template v-if="equipObj.type == 40">
                    <el-collapse-item 
                        title="装置地图" 
                        name="5"
                    >   
                        <div class="center">
                            <cc-mapSingle 
                                vid="alarmDetail"
                                :deviceParams="single"
                                :hasSearch="false"
                                :hasClick="false"
                                hasUpdate
                            />
                        </div>
                    </el-collapse-item>
                </template> -->
            </el-collapse>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { LineChart } from '@/components/Charts'
    import { 
        tip,
        getUnit, 
        timeDiff, 
        PICKER_MENU,
        PARAM_NAME,
        RETURN_PARAMS,
        BASIC_MENU,
        VALUS
    } from '@/utils/methods'
    import { request } from '@/utils/Request'
    import { api } from '@/utils/API'

    //装置类型
    const DEVICE_TYPE = {
        30:"电缆监测终端(魔节)",
        32:"红外传感器",
        33:"低压集中器",
        35:"烟雾传感器",
        36:"低压传感器(魔戒)",
        37:"液位传感器",
        38:"线缆温度传感器",
        40:"电缆定位桩"
    }

    // 实时数据接口
    const CURRENT_INTERFACE = {
        30:api.getMagicCurrentData,//魔节
        32:api.getInfraredCurrentData, //红外
        33:api.getConcentratorCurrentData,//集中器
        35:api.getSmokeCurrentData,//烟感
        36:api.getRingCurrentData, //魔戒
        37:api.getLiquidLevelCurrentData,//水位
        38:api.getCableTempCurrentData, //线缆温度传感器
        40:api.getCablePileCurrentData//电缆定位桩
    }

    // 历史数据接口
    const HISTORY_INTERFACE = {
        30:api.getMagicHistoryData_mini,//魔节
        32:api.getInfraredHistoryData, //红外
        33:api.getConcentratorHistoryData,//集中器
        35:api.getSmokeHistoryData,//烟感
        36:api.getRingHistoryData, //魔戒
        37:api.getLiquidLevelHistoryData,//水位
        38:api.getCableTempHistoryData, //线缆温度传感器
        40:api.getCablePileHistoryData//电缆定位桩
    }

    export default {
        props: {
            hasClose:{
                type:Boolean,
                default:false
            },
            close:{
                type:Function,
                default:()=>{}
            }   
        },
        components: {
            LineChart,
        },
        data() {
            return {
                activeNames: ['1','2','3','4','5','6'],
                single:{
                    magicName:'',
                    concenName:'',
                    position:[],
                    location:'',
                    createTime:'',
                },
                warnStatus: 2,
                concentrator_data:{},
                gaugePile_data:{},
                device_data:{},
                client:null,
                alarmList:[],
                
                value: 'v',
                loading:false,
                alarmLoading:false,
                activateStatus: null, // 激活状态mqtt
                alaramStatus: null, // 告警状态mqtt
                isChange:false,

                time: [
                    this.$moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                deviceName:"",
                hasAlarm:"",
                basicMenu:[],
                pileState:{}, // 电缆桩状态
                realData:[],//实时数据
                columns: [],
                history_data:{},
                currentHistoryData:{},
                startTime: 0 ,
                // .subtract(7, 'day')
                endTime: 0,
                basic_loading:true,
                current_loading:true,
                alarm_value:VALUS,
                deviceType:30,
                warnItem:{},
            }
        },
        created () {
            const { name, type } = this.equipObj;
            this.$route.meta.title = name;

            this.columns = PICKER_MENU[type];
            this.value = PICKER_MENU[type][0].value;

            // 1. 获取装置详情
            this.getDeviceDetail();

            // 2. 获取实时数据
            this.getCurrentData();

            // 3. 获取历史数据
            this.getHistoryData();

            // 4. 获取告警信息
            this.getLastWarnList();

        },
        mounted () {
            this.$once('hook:beforeDestroy', () => {
                this.client && this.client.end();
                this.activateStatus && this.activateStatus.end();
                this.alaramStatus && this.alaramStatus.end();
            });
        },
        watch: {
            // "single.masterStatus"(value) {
            //     if( value == 2 && this.isChange ){
            //         this.hasCurrentandHistory();
            //     }else if( value == 0 ){
            //         this.client && this.client.end();
            //     }
            // }
        },
        computed: {
            equipObj() {
                return JSON.parse(sessionStorage.getItem('equipObj'));
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        methods: {
            ...mapActions('equip',[
                'getOtherCurrentData',
                'getOtherHistoryData',
                "exportOherHistoryData",
                "activatePile",
                "relieveAlarmOfPile",
                "getAlaramStatusOfPile"
            ]),
            ...mapActions('overall',[
                'getGeocode',
                'getAlarmList_old'
            ]),
            // 有实时数据以及历史数据(现仅用于集中器 & 定位桩)
            // hasCurrentandHistory( ){
            //     const { deviceType } = this.equipObj;
                
            //     if( deviceType != 33 && deviceType != 40 )  return;
                
            //     if( deviceType == 40 && this.single.masterStatus != 2) return;

            //     this.getDeviceCurrentData();

            //     this.mqttConnection();

            //     // 判断是集中器还是定位桩类型
            //     this.value = deviceType == 33 ? "v" : "batteryV"; 

            //     // 获取历史数据
            //     this.getDeviceHistoryData();
                
            // },
            //切换日期
            changeDate(date){
                if( !date )return;
                this.time = [ date[0], date[1] ];
                this.getHistoryData();
            },
            //切换环境变量
            changeParam(val){
                this.value = val;
                this.currentHistoryData = {
                    type:val,
                    timeArr:this.history_data.timeArr,
                    dataArr:[{
                        type:"line",
                        data:this.history_data[val]
                    }]
                }
            },
            
            /**
             * 装置详情
             * 判断颜色状态
             */
            diffColor(k,v){
                if(k == "voltage" && v == "0") return "text_alarm";
                if( k != "voltage" && v == "1" ) return "text_alarm";
                return "text_normal"
            },
            /**
             * 告警,过滤没数据的告警类型
             */
            noHasDecodeHex(code){
                // 1018:失电掉电 1045:433超时故障 1013:线缆电压超限 1056:失压 1017:有人
                var noHasArr = [ 1045, 1018, 1013, 1056, 1017, 1002, 1001 ];

                var has = false;
                for(var i = 0; i < noHasArr.length; i++){
                    if(noHasArr[i] == +code ){
                        has = true;
                        break;
                    }
                }
                return has;
            },

            // 通过Mqtt获取实时数据
            mqttConnection(){
                const { deviceAdress } = this.equipObj;

                //通过Mqtt获取实时数据
                this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
                this.$mqtt.listen(this.client,res=>{
                    const { data, fc, address, time } = res;

                    if( address != deviceAdress|| (fc != 33 && fc != 40) ) return;

                    console.log(res,(fc == 33? "集中器数据": "电缆定位桩数据"));
                    this.device_data = {
                        createTime:this.$moment(time).format('YYYY-MM-DD HH:mm:ss'),
                        signalNB:{ keyValue: data.signalNB || null },
                        v:{ keyValue:data.v || null },
                        illumination:{ keyValue: data.illumination > -1? data.illumination: null },
                        inclination:{ keyValue: data.inclination || null },
                        batteryV:{ keyValue: data.batteryV || null }
                    }

                    if(fc == 40 && data.inclination && (data.inclination != this.single.remark2)){
                        this.single = {
                            ...this.single,
                            remark2: data.inclination,
                            warnStatus: this.warnStatus
                        }
                    }
                })
            },

            /**
             * 获取装置详情
             */
            getDeviceDetail(){
                const { id, type } = this.equipObj;
                request({
                    url:`${api.getDeviceDetail}?id=${id}&deviceType=${type}`,
                    method:"get",
                }).then(res=>{
                    if( !res ){
                        tip("装置基本信息查询失败");
                    }else{
                        if( res && res.data ){
                            const DATA = res.data;
                            let result = [];
                            for(let i in DATA){
                                if( BASIC_MENU[i] && DATA[i] != null ){
                                result.push({
                                    id:i,
                                    title:i==="fatherName"?`${BASIC_MENU[i].name}${type==36?"集中器":"魔节"}` :BASIC_MENU[i].name,
                                    value:VALUS[i]? VALUS[i][DATA[i]]:type == 36&&i=="affiliation"?`${DATA[i]}/${DATA["phaseSequence"]}` :DATA[i],
                                    initial_value:DATA[i],
                                    sort:BASIC_MENU[i].sort
                                })
                                }
                            }
                            // 1.添加设备类型
                            result.unshift({ id, title:"装置类型", value:DEVICE_TYPE[type],sort:2 });
                            // 2.排序
                            result.sort(function (a, b) {
                                return (a.sort - b.sort)
                            });

                            // 当装置为"电缆定位桩"时,保存装置状态
                            if( type == 40 ){
                                /**
                                 * activationState 1、已激活；2、未激活；3、激活中
                                 * warnState 1、解决告警，2、解除中，3、正常
                                 */
                                let activationState = { "已激活":1, "未激活":2, "激活中":3 };
                                let warnState = { "解决告警":1, "解除中":2, "正常":3 };

                                this.pileState = {
                                    activationState:activationState[DATA["activationState"]],
                                    warnState:warnState[DATA["warnState"]]
                                }
                            }

                            this.basicMenu = result;
                            this.deviceName = DATA["name"];
                        }
                    };
                })
            },
            /**
             * 获取实时数据
             */
            getCurrentData(){
                // 根据装置类型请求对应实时数据接口
                const { type, assetsCode } = this.equipObj;
                const URL = CURRENT_INTERFACE[type];
                request({
                    url:`${URL}?deviceAdress=${assetsCode}&projectId=${+this.projectId}`,
                    method:"get",
                }).then(res=>{
                    if( !res ){
                        tip("实时数据查询失败");
                    }else{
                        if( res && res.data.length ){
                            const DATA = res.data[0];
                            let result = [];
                            for(let i in DATA){
                                if(PARAM_NAME[i]){
                                result.push({
                                    id:i,
                                    title:PARAM_NAME[i],
                                    value:VALUS[i]? `${VALUS[i][i=="co"? +DATA[i]>50?1:0 :+DATA[i]]} ${getUnit(i)}`: `${DATA[i]} ${getUnit(i)}`, // 烟感,一氧化碳浓度>50时为过高,反之为正常
                                    initial_value:+DATA[i]
                                })
                                }
                            }
                            this.realData = {
                                data:result,
                                dataTime:DATA["dataTime"]
                            }
                        }
                    };
                })
            },
            /**
             * 获取历史数据
             */
            getHistoryData(){
                // 根据装置类型请求对应历史数据接口
                const { type, assetsCode } = this.equipObj;
                const [ startTime, endTime ] = this.time;

                const URL = HISTORY_INTERFACE[type];
                const box = JSON.parse(JSON.stringify(RETURN_PARAMS[type]));

                request({
                    url:`${URL}?deviceAdress=${assetsCode}&startDataTime=${startTime}&endDataTime=${endTime}&projectId=${+this.projectId}`,
                    method:"get",
                }).then(res=>{
                    if( !res ){
                        tip("历史数据查询失败");
                    }else{
                        /**
                         * 数据栏,时间栏
                         */
                        if( res && res.data ){
                            const result = res.data.reduce((pre,cur)=>{
                                for(let i in cur){
                                    if( PARAM_NAME[i] && cur[i] != "--" ){
                                        pre[i].push([this.$moment(cur.dataTime).format(timeDiff(startTime,endTime)),cur[i]])
                                    }
                                }
                                pre["timeArr"].push(this.$moment(cur.dataTime).format(timeDiff(startTime,endTime)));
                                return pre;
                            },{
                                ...box,
                                timeArr:[]
                            });

                            this.history_data = result;
                            this.currentHistoryData = {
                                type:this.value,
                                timeArr:result.timeArr,
                                dataArr:[{
                                    type:"line",
                                    data:result[this.value]
                                }]
                            }
                        }else{
                            this.history_data = [];
                            this.currentHistoryData = {};
                        }
                    };
                })
            },
            /**
             * 更新电缆定位桩状态
             */
            updatePileState(type){
                const { id } = this.equipObj;
                let param = { positioningPileInfoId: +id };
                type == "activationState"? param.isActivation = 3 : param.isWarn = 3;

                request({
                    url:api.updatePileState,
                    method:"post",
                    data:param
                }).then(res=>{
                    if(res){
                        let temp = this.pileState;
                        isActivation? temp.activationState = 3 : temp.warnState = 3;
                        this.pileState = temp
                    }else{
                        tip("定位桩状态修改失败");
                    }
                })
            },
            /**
             * 获取单个装置最新告警
             */
            getLastWarnList(){
                const { assetsCode } = this.equipObj;

                request({
                    url:`${api.getLastWarnList}?projectId=${this.projectId}&address=${assetsCode}&count=1`,
                    method:"get"
                }).then(res=>{
                    if( res && res.data){
                        this.warnItem = res.data[0];
                    }
                })
            },

            //-------------------电缆桩-------------------------------------
            // 激活电缆桩
            activate_Pile(){
                this.activatePile(this.single.deviceAdress).then(res=>{
                    if(!res) return;
                    this.single.masterStatus = 1;
                });
            },
            // 解决告警状态
            relieve_alaram(){
                this.relieveAlarmOfPile(this.single.deviceAdress).then(res=>{
                    if(!res) return;
                    // 未解除 -> 解除中
                    this.warnStatus = 1;
                });
            },
            // 获取告警状态
            get_alarm_status(){
                this.getAlaramStatusOfPile(this.single.deviceAdress).then(res=>{
                    if(!res) return;
                    this.warnStatus = +res.warnStatus;
                    this.single.warnStatus  = +res.warnStatus;
                })
            },
            // 获取激活状态/告警状态
            mqttPileStatus(){
                this.activateStatus = this.$mqtt.connect(`topic_activate_${this.projectId}`);
                this.alaramStatus = this.$mqtt.connect(`topic_remove_${this.projectId}`);

                this.$mqtt.listen(this.activateStatus,res=>{
                    console.log(res,"激活状态");
                    const { address, data } = res;
                    if( address != this.single.deviceAdress) return;

                    // 如果返回的"已激活" && 当前状态已经是2的情况下, 不重复请求
                    this.isChange = data == 2 && (this.single.masterStatus == 2) ? false : true;
                    
                    this.single.masterStatus = +data;
                })

                this.$mqtt.listen(this.alaramStatus,res=>{
                    console.log(res,"告警状态");
                    const { address, data } = res;
                    if( address != this.single.deviceAdress) return;
                    this.warnStatus = +data;
                })
            },
        },
    }
</script>

<style lang="scss">
    .el-collapse-item__header{
        font-size: 15px !important;
        font-weight: bold !important;
        color: #3182cb !important;
        height: 40px !important;
        line-height: 40px !important;
    }
    .Equip_Detail{
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;
        .el-icon-back{
            border-radius: 5px;
            position: absolute;
            right: 0px;
            top: 15px;
            font-size: 1.4rem;
            cursor: pointer;
            background: #ecefef;
        }
        .wrap{
            box-sizing: border-box;
            padding: 20px;
            width: 1100px;
            max-width: 100%;
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) ;
            font-size: 0.75rem;
            margin: 0 auto;
            .el-divider--horizontal{
                margin: 28px 0;
            }
            .intro{
                div{
                    display: flex;
                    // align-items: center;
                    margin: 15px 0 ;    
                    strong{
                        width: 30%;
                    }
                    span{
                        .el-image{
                            width: 5rem;
                            height: 5rem;
                            margin-right: 10px;
                            border-radius: 5px;
                        }
                    }
                    .point{
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                    }
                    .alarm{
                        background-color: red;
                    }
                    .normal{
                        background-color: green;
                    }
                }

                .realTime_wrap,.alarm_wrap{
                    display: flex;
                    flex-direction: column;
                    .dataTime{
                        padding: 20rpx 32rpx;
                        font-weight: 600;
                        color: black;
                    }
                }
                .text_normal{
                    color: green;
                }
                .text_alarm{
                    color: red;
                }
                .empty{
                    width: 100%;
                }
            }
            .center{
                margin-bottom: 15px;
                .seletGroup{
                    display: flex;
                    align-items: center;
                    .el-form{
                        width: 100%;
                        display: flex;
                        .el-form-item{
                            padding: 0 10px;
                        }
                        .el-icon-download{
                            cursor: pointer;
                            background: #ecefef;
                            padding: 10px;
                            border-radius: 5px;
                        }
                    }
                }
                .el-icon-refresh{
                    cursor: pointer;
                    margin-left: 5px;
                    color: #22a7f0;
                }
                @media screen and (max-width: 650px) {
                    .seletGroup{
                        .el-form{
                            flex-direction: column;
                        }
                    }
                }
            }
        }
        .el-icon-warning,.el-icon-refresh{
            padding: 0px 5px;
        }
    }
</style>