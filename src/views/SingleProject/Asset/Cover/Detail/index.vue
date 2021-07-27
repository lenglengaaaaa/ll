<template>
    <cc-assetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="数据视图" lazy>
                <el-collapse v-model="activeNames">
                    <!-- 告警信息 -->
                    <el-collapse-item title="告警信息" name="1">
                        <div class="box alarm_info">
                            <template v-if="warnList.length">
                                <div class="alarm_info_box">
                                    <div v-for="(item,index) in warnList " :key="index">
                                        <div class="alaram_box" >
                                            <strong class="title">告警装置 :</strong>
                                            <span class="value"> {{item.name}} </span>
                                        </div>
                                        <div class="alaram_box" >
                                            <strong class="title">告警内容 :</strong>
                                            <span class="value red"> {{ item.typeName || '----' }}{{ item.decodeHex }} </span>
                                        </div>
                                        <div class="alaram_box" >
                                            <strong class="title">告警时间 :</strong>
                                            <span class="value"> {{ item.createTime }} </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="empty">
                                    <cc-empty text="无告警数据" />
                                </div>
                            </template>
                        </div>
                    </el-collapse-item>

                    <!-- 线缆 -->
                    <el-collapse-item title="线缆" name="2">
                        <template v-if="cableTempList.length">
                            <el-row :gutter="40">
                                <el-col :span="12" :xs="24" v-for="item in cableTempList" :key="item.cableDataId">
                                    <div class="info">
                                        <div class="info_top">
                                            <el-popover
                                                placement="bottom"
                                                width="200"
                                                trigger="click"
                                            >
                                                <div class="pop">
                                                    <div class="line_detail">
                                                        <div class="detail_item">
                                                            <span class="title">线缆温度 :</span>
                                                            <span class="value"> {{ item.lineTemp }} ℃ </span>
                                                        </div>
                                                        <div class="detail_item">
                                                            <span class="title">电池电压 : </span>
                                                            <span class="value"> {{ item.batteryV }} V </span>
                                                        </div>
                                                        <div class="detail_item">
                                                            <span class="title">震动数据 :</span>
                                                            <span class="value"> {{ item.shake&&item.shake == 1 ?'震动':'静止' }} </span>
                                                        </div>
                                                        <div class="detail_item">
                                                            <span class="title">板子自身温度 :</span>
                                                            <span class="value"> {{ item.cbTemp }} ℃ </span>
                                                        </div>
                                                        <div class="detail_item">
                                                            <span class="title">信号强度 :</span>
                                                            <span class="value"> {{ item.signalIntensity }} dbm</span>
                                                        </div>
                                                    </div>
                                                </div>  
                                                <el-button type="text" slot="reference" class="link">{{ item.name }}</el-button>
                                            </el-popover>
                                            <strong class="msg">
                                                线缆温度:<span>{{ item.lineTemp || 'xxx' }}</span>℃ &nbsp;&nbsp;
                                            </strong>
                                        </div>
                                        
                                        <el-progress 
                                            :percentage="(item.lineTemp/100) * 100" 
                                            :show-text="false"
                                        />
                                        <div class="info_bottom">
                                            <span class="time">
                                                数据上传时间 : <strong>{{ item.dataTime || '未知' }}</strong>
                                            </span>
                                        </div>
                                        <!-- :color="customColors"  -->
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-else>
                            <cc-empty text="无实时数据" />
                        </template>
                    </el-collapse-item>

                    <!-- 线缆温度历史数据 -->
                    <el-collapse-item title="线缆温度历史数据" name="3">
                        <div v-if="cableTempList.length">
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
                            />
                            <LineChart
                                id="line"
                                ref="lineChart"
                                :value="cableTemp_data"
                            />
                        </div>
                        <div v-else>
                            <cc-empty text="无历史数据" />
                        </div>
                        

                    </el-collapse-item>

                    <!-- 电缆井 -->
                    <el-collapse-item title="电缆井" name="4">
                        <div class="box magic">
                            <template v-if="magicAddressList.length > 1">
                                <div>
                                    <el-tabs v-model="magic_active" @tab-click="tabClick">
                                        <el-tab-pane 
                                            v-for="item in magicAddressList"
                                            :key="item.address"
                                            :label="item.name" 
                                            :name="item.address"
                                        />
                                    </el-tabs>
                                </div>
                            </template>
                            <div class="realTime_data">
                                <template v-if="magic_realData.dataTime">
                                    <div>
                                        <div class="dataTime">
                                            数据上传时间 : {{ magic_realData.dataTime }}
                                        </div>
                                        <div 
                                            v-for="item in magic_realData.data "  
                                            :key="item.id"
                                        >
                                            <div class="sensor_box">
                                                <div class="title">{{ item.title }}</div>
                                                <div 
                                                    class="value"
                                                    :style="{color: item.initial_value == 1 ? 'red' : ''}"
                                                >
                                                    {{ item.value }}
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="red_realData.name">
                                            <div>
                                                <div class="sensor_box">
                                                    <div class="title">{{ red_realData.name }}</div>
                                                    <div 
                                                        class="value"
                                                        :style="{color: red_realData.initValue == 1 ? 'red' : 'green'}"
                                                    >
                                                        {{ red_realData.infrared }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="water_realData.length">
                                            <div
                                                v-for="item in water_realData"  
                                                :key="item.id"
                                            >
                                                <div class="sensor_box">
                                                    <div class="title">{{ item.name }}(水位)</div>
                                                    <div 
                                                        class="value"
                                                        :style="{color: item.initValue == 1 ? 'red' : 'green'}"
                                                    >
                                                        {{ item.liquid }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="smoker_realData.name">
                                            <div>
                                                <div class="sensor_box">
                                                    <div class="title">{{ smoker_realData.name }}</div>
                                                    <div 
                                                        class="value"
                                                        :style="{color: smoker_realData.initValue == 1 ? 'red' : 'green'}"
                                                    >
                                                        {{ smoker_realData.co }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template v-else>
                                    <cc-empty text="无实时数据" />
                                </template>
                            </div>
                        </div>
                    </el-collapse-item>

                </el-collapse>
            </el-tab-pane>
        </template>
    </cc-assetDetail>
</template>

<script>
    import { mapActions } from 'vuex'
    import { LineChart } from '@/components/Charts'
    import { 
        getUnit, 
        timeDiff, 
        PICKER_MENU,
        PARAM_NAME,
        VALUS
    } from '@/utils/methods'
    import { request } from '@/utils/Request'
    import { api } from '@/utils/API'
    
    export default {
        components: {
            LineChart,
        },
        data() {
            return {
                hasDevice: false,

                warnList:[],
                wellName:"",

                cableTempMenu:PICKER_MENU[38],
                cableTempType:"lineTemp",

                // 列表
                magicAddressList:[],
                magic_active:0,
                cableAddressList:[],
                redAddressList:[],
                smokerAddressList:[],
                waterAddressList:[],

                // 实时数据
                magic_realData:{},
                history_data:{}, //总历史数据
                cableTemp_data:{},

                time: [
                    this.$moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],

                red_realData:{},
                water_realData:[],
                smoker_realData:{},

                show:false,
                cableTempItem:{},
                cableTempList:[],

                activeNames: ['1','2','3','4','5','6'],

                loading:true
            }
        },
        computed: {
            trapItem() {
                return JSON.parse(sessionStorage.getItem("obj"));
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem("project")).id;
            }
        },
        created () {
            const { name, trapName } =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title= name||trapName;
        },
        mounted(){
             // 获取电缆井最新的告警数据
            this.getNewWarnOfTrap()

            // 获取电缆井下资产列表
            this.getTrapAllDeviceMenu();
            
            // 获取独立传感器实时数据
            this.getAllNewRedInfo();
            this.getAllNewWaterInfo();
            this.getAllNewSmokerInfo();

            // 获取线缆温度传感器实时数据列表
            this.getCableTempListByTrap();
        },
        methods: {
            // tab标签切换事件
            tabClick(e){
                const index = +e.index;
                const { address } = this.magicAddressList[index];

                this.magic_active = address;
                this.getCurrentData(address);
            },
             //切换日期
            changeDate(date){
                if( !date )return;
                this.time = [ date[0], date[1] ];
                this.getCableHistoryListByTrap();
            },
            /**
             * 获取电缆井下装置列表
             */
            getTrapAllDeviceMenu(){
                const { id } = this.trapItem;
                request({
                    url:api.getTrapAllDeviceMenu,
                    method:"post",
                    data:{ id }
                }).then(res=>{
                    if( res && res.data ){
                        const { magicAddressList, cableAddressList, redAddressList, smokerAddressList, waterAddressList } = res.data;

                        const listsName = ["magicAddressList","cableAddressList","redAddressList","smokerAddressList","waterAddressList"];

                        let hasDevice = false;
                        for( let k in res.data){
                            if( listsName.includes(k) && res.data[k].length){
                                hasDevice = true;
                                break
                            }
                        }
                        
                        this.magicAddressList = magicAddressList;
                        this.cableAddressList = cableAddressList;
                        this.redAddressList = redAddressList;
                        this.smokerAddressList = smokerAddressList;
                        this.waterAddressList = waterAddressList;
                        this.hasDevice = hasDevice;

                        // 请求魔节实时&历史数据
                        if( magicAddressList.length ){
                            const { address } = magicAddressList[0];
                            this.magic_active = address;

                            this.getCurrentData(address);
                        };
                        if( cableAddressList.length ){
                            this.getCableHistoryListByTrap();
                        }

                    }else{
                        tip('获取装置列表失败');
                    }
                })
            },
            /**
             * 获取魔节实时数据
             */
            getCurrentData(deviceAdress){
                // 根据装置类型请求对应实时数据接口
                request({
                    url:`${api.getMagicCurrentData}?deviceAdress=${deviceAdress}&projectId=${this.projectId}`,
                    method:"get",
                }).then(res=>{
                    if( !res ){
                        tip("实时数据查询失败");
                    }else{
                        if( res && res.data && res.data.length ){
                            const DATA = res.data[0];
                            let result = [];
                            for(let i in DATA){
                                if(PARAM_NAME[i]){
                                    result.push({
                                        id:i,
                                        title:PARAM_NAME[i],
                                        value:VALUS[i]? `${VALUS[i][DATA[i]]} ${getUnit(i)}`:DATA[i]? `${DATA[i]} ${getUnit(i)}`:`--- ${getUnit(i)}`,
                                        initial_value:DATA[i]
                                    })
                                }
                            }

                            this.magic_realData = {
                                data:result,
                                dataTime:DATA["dataTime"]
                            }
                        }else{
                            this.magic_realData = {
                                data:[],
                                dataTime:""
                            }
                        }
                    };
                })
            },
            /**
             * 获取线缆温度传感器实时数据列表
             */
            getCableTempListByTrap(){
                const { id } = this.trapItem;

                request({
                    url:api.getCableTempListByTrap,
                    method:'post',
                    data:{
                        id
                    }
                }).then(res=>{
                    if( res && res.data ){
                        this.cableTempItem = res.data[0];
                        this.cableTempList = res.data;
                    }
                })
            },
            /**
             * 获取线缆温度传感器历史数据列表
             */
            getCableHistoryListByTrap(){
                const { id } = this.trapItem;
                const [ startTime, endTime ] = this.time;

                request({
                    url:api.getCableHistoryListByTrap,
                    method:'post',
                    data:{
                        id,
                        startTime,
                        endTime
                    }
                }).then(res=>{
                    if( res ){
                        const hasParam = ["lineTemp","lineA","lineV","batteryV","cbtemp","shake","signalIntensity","dataTime"];
                        const { cableDateMap } = res;
                        let obj = {};
                        let timeArr = [];
                        const diffTime = timeDiff(startTime,endTime);

                        for( let i in cableDateMap){
                            obj[i] = cableDateMap[i].reduce((pre,cur)=>{
                                for( let k in cur){
                                if(hasParam.includes(k)){
                                    if( k === "dataTime"){
                                        timeArr.push(this.$moment(cur.dataTime).valueOf());
                                    }else{
                                        pre[k].push([this.$moment(cur.dataTime).format(diffTime),cur[k]]);
                                    }
                                }
                                }
                                
                                return pre;

                            },{
                                "lineTemp":[],"lineA":[],"lineV":[],
                                "batteryV":[],"cbtemp":[],"shake":[],
                                "signalIntensity":[]
                            })
                        }
                        const timeResult = timeArr.sort(function(a, b){return a - b}).map(item => this.$moment(item).format(diffTime))

                        const dataResult =  [];
                        for( let h in obj ){
                            dataResult.push({
                                data:obj[h][this.cableTempType],
                                type:"line",
                                name: this.cableAddressList.filter(item=>item.id == h)[0].name
                            })
                        }
                        
                        this.history_data[38]  = { data:obj, timeArr:timeResult };
                        this.cableTemp_data = {
                            type:this.cableTempType,
                            timeArr:timeResult,
                            dataArr:dataResult
                        }

                    }
                })
            },
            /**
             * 获取电缆井下的所有红外最新数据
             */
            getAllNewRedInfo(){
                const { id } = this.trapItem;
                request({
                    url:api.getAllNewRedInfo,
                    method:'post',
                    data:{
                        id
                    }
                }).then(res=>{
                    if( res && res.data && res.data.length ){
                        let value  = { name: "红外检测",  initValue: 0, infrared: "" };
                        for( let i in res.data ){
                            value.initValue = res.data[i].infrared;
                            value.infrared = VALUS["infrared"][res.data[i].infrared];
                            if( res.data.infrared == 1) return;
                        }
                        
                        this.red_realData = value;
                    } 
                })
            },
            /**
             * 获取电缆井下的所有液位最新数据
             */
            getAllNewWaterInfo(){
                const { id } = this.trapItem;
                request({
                    url:api.getAllNewWaterInfo,
                    method:'post',
                    data:{
                        id
                    }
                }).then(res=>{
                    if( res && res.data ){
                        const result = res.data.map(cur=>{
                            return {
                                id:cur.levelInfoId,
                                name: cur.name,
                                initValue:cur.liquid,
                                liquid: VALUS["liquid"][cur.liquid],
                                dataTime: cur.dataTime
                            }
                        })

                        this.water_realData = result;
                    } 
                })
            },
            /**
             * 获取电缆井下的所有烟感最新数据
             */
            getAllNewSmokerInfo(){
                const { id } = this.trapItem;
                request({
                    url:api.getAllNewSmokerInfo,
                    method:'post',
                    data:{
                        id
                    }
                }).then(res=>{
                    if( res && res.data ){
                        let value  = { name: "一氧化碳浓度",  initValue: 0, co: "" };
                        for( let i in res.data ){
                            value.initValue = +res.data[i].co > 50 ? 1 : 0;
                            value.co = VALUS["co"][+res.data[i].co> 50 ? 1 : 0];
                            if( (+res.data[i].co> 50 ? 1 : 0) == 1) return;
                        }

                        this.smoker_realData = value;
                    } 
                })
            },
            /**
             * 获取电缆井最新的告警数据
             */
            getNewWarnOfTrap(){
                const { id } = this.trapItem;
                request({
                    url:api.getNewWarnOfTrap,
                    method:'post',
                    data:{
                        id,
                        projectId:this.projectId
                    }
                }).then(res=>{
                    if( res && res.data ){
                        this.warnList = res.data;
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .alarm_info{
        display: flex;
        flex-wrap: wrap;
        .alarm_info_box{
            border: 1px solid #dadada;
            border-radius: 10px;
            flex: 0.3;
            padding: 10px;
            .alaram_box{
                text-align: center;
                padding: 10px 0;
                .title{
                    width: 40%;
                }
                .value{
                    padding-left: 15px;
                    font-weight: bold;
                }
                .red{
                    color: red;
                }
            }
        }
        .empty{
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }

    .info{
        .info_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }   
        .info_bottom{
            padding: 10px 0;
            display: flex;
            justify-content: flex-end;
        }
    }

    .pop{
        .line_detail{
            .detail_item{
                display: flex;
                justify-content: center;
                padding: 8px 0;
                .title{
                    font-weight: bold;
                    color: black;
                    padding-right: 10px;
                }
                .value{
                }
            }
        }
    }


    .magic{
        // display: flex;
        // flex-direction: column;
        // // justify-content: center;
        .el-tabs .el-tabs__content{
            height: 0px !important;
        }
        .realTime_data{
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            .dataTime{
                padding-bottom: 10px;
                font-weight: bold;
            }
            .sensor_box{
                padding: 10px 0;
                display: flex;
                justify-content: space-between;
                .title{
                    width: 40%;
                }
                .value{
                    font-weight: bold;
                }
            }
        }
    }
</style>