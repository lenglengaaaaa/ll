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
                            <p>
                                <strong>设备图片</strong>
                                <span>
                                    <el-image
                                        v-for="item in imageUrls"
                                        :key="item.id"
                                        :src="item.imagePath"
                                    />
                                </span>
                            </p>
                            
                            <p v-for="item in firstArray" :key="item.sign">
                                <strong>{{item.title}}</strong>
                                <span>{{item.value || 'xxx'}}</span>
                            </p>
                            <p>
                                <strong>设备地址</strong>
                                <span>{{single.location}}</span>
                            </p>
                            <p>
                                <strong>创建时间</strong>
                                <span>{{single.createTime}}</span>
                            </p>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="从属关系" name="2">
                    <div class="center">
                        <div class="intro">
                            <p v-for="item in secondArray" :key="item.sign">
                                <strong>{{item.title}}</strong>
                                <span>{{item.value || 'xxx'}}</span>
                            </p>
                            <p>
                                <strong>所属魔节</strong>
                                <span>{{single.magicName || 'xxx'}}</span>
                            </p>
                            <p>
                                <strong>所属集中器</strong>
                                <span>{{single.concenName || 'xxx'}}</span>
                            </p>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item 
                    title="实时数据" 
                    name="3"
                    v-if="equipObj.deviceType == 33 || equipObj.deviceType == 40"
                >
                    <div class="center" >
                        <div class="intro">
                            <p>
                                <strong>上报时间 :</strong>
                                <span :style="{fontWeight:'bold'}">
                                    {{ device_data.createTime || '---'}}
                                </span>
                            </p>

                            <!-- 集中器 -->
                            <template v-if="equipObj.deviceType == 33">
                                <p>
                                    <strong>电压(V)</strong>
                                    <span :style="{fontWeight:'bold'}">
                                        {{ `${( device_data.v && device_data.v.keyValue ) || '---'} V` }}
                                    </span>
                                </p>
                                <p>
                                    <strong>信号强度(csq)</strong>
                                    <span :style="{fontWeight:'bold'}">
                                        {{ `${( device_data.signalNB && device_data.signalNB.keyValue ) || '---'} csq` }}
                                    </span>
                                </p>
                            </template>

                            <!-- 电缆定位桩 -->
                            <template v-else>
                                <p>
                                    <strong>电池电压(V)</strong>
                                    <span :style="{fontWeight:'bold'}">
                                        {{ `${( device_data.batteryV && device_data.batteryV.keyValue) || '---'} V` }}
                                    </span>
                                </p>
                                <p>
                                    <strong>倾斜角度(°)</strong>
                                    <span :style="{fontWeight:'bold'}">
                                        {{ `${( device_data.inclination && device_data.inclination.keyValue) || '---'} °` }}
                                    </span>
                                </p>
                                <p>
                                    <strong>光照强度(lx)</strong>
                                    <span 
                                        :style="{ 
                                            color:
                                                device_data.illumination && device_data.illumination.keyValue != '--' && device_data.illumination.keyValue  ? device_data.illumination.keyValue == 0? 'red': '': '',
                                            fontWeight:'bold',
                                        }"
                                    >
                                        {{
                                            `${
                                                device_data.illumination && device_data.illumination.keyValue != "--" && device_data.illumination.keyValue  ? 
                                                    device_data.illumination.keyValue == 0? "光线不足": "光线正常": '---'
                                            }`
                                        }}
                                    </span>
                                </p>
                            </template>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item 
                    title="历史数据" 
                    name="4"
                    v-if="equipObj.deviceType == 33 || equipObj.deviceType == 40"
                >
                    <div  class="center">
                        <div>
                            <div class="seletGroup">
                                <el-form label-position="top">
                                    <el-form-item label="环境变量:">
                                        <el-select v-model="value" @change="changeParam">
                                            <el-option
                                                v-for="item in (equipObj.deviceType==33? conOptions: pileOptions)"
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
                                            :disabled="loading"
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
                                ref="lineChart"
                                :value="currentValue"
                                :timeArray="timeArray"
                                :unit="value"
                            />
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="告警信息" name="5">
                    <template slot="title">
                        告警信息
                        <el-tooltip 
                            effect="dark" 
                            placement="top-start" 
                            content="显示最近七天内20条告警, 如需查看更久的告警信息请通过告警管理模块进行查询." 
                        >
                            <i class="el-icon-warning"/>
                        </el-tooltip>
                    </template>
                    <div class="center">
                        <el-table
                            :data="alarmList"
                            border
                            stripe
                            max-height="250"
                            empty-text="暂无数据"
                            v-loading="alarmLoading"
                        >
                            <el-table-column
                                label="告警详情"
                                align="center"
                            >
                                <template slot="header" >
                                    告警信息
                                    <i class="el-icon-refresh" @click="this.getEquipAlaramList"></i>
                                </template>
                                <template slot-scope="scope" >
                                    <span style="color:red">
                                        {{scope.row.decodeHex}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createTime"
                                label="告警时间"
                                align="center"
                                :formatter="(row)=>this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')"
                            />
                        </el-table>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div>
                <cc-mapSingle 
                    vid="alarmDetail"
                    :deviceParams="single"
                    :hasSearch="false"
                    :hasClick="false"
                    hasUpdate
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { LineChart } from '@/components/Charts'
    import { lastDataFilter, downFile } from '@/utils/methods'

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
                activeNames: ['1','2','3','4','5'],
                firstArray:[
                    {title:'设备类型',sign:'typeName',value:''},
                    {title:'设备名称',sign:'name',value:''},
                    {title:'设备EUI',sign:'deviceEui',value:''},
                    {title:'设备编号',sign:'number',value:''},
                    // {title:'设备地址域',sign:'deviceAdress',value:''},
                ],
                secondArray:[
                    {title:'所属台区',sign:'courtsName',value:''},
                    {title:'所属配电房',sign:'roomName',value:''},
                    {title:'所属配电柜',sign:'chestName',value:''},
                    {title:'所属井盖',sign:'trapName',value:''},
                    {title:'所属线缆',sign:'lineName',value:''},
                ],
                imageUrls:[],
                single:{
                    magicName:'',
                    concenName:'',
                    position:[],
                    location:'',
                    createTime:''
                },
                concentrator_data:{},
                gaugePile_data:{},
                device_data:{},
                client:null,
                alarmList:[],
                time: [
                    this.$moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                timeArray:[],
                currentValue:[],
                conOptions: [
                    {value: 'v',label: '电压'}, 
                    {value: 'signalNB',label: '信号强度'}
                ],
                pileOptions:[
                    {value: 'batteryV',label: '电池电压'}, 
                    {value: 'illumination',label: '光照强度'},
                    {value: 'inclination',label: '倾斜角度'}
                ],
                value: 'v',
                loading:false,
                alarmLoading:false
            }
        },
        created () {
            const { name, deviceAdress, deviceType } = this.equipObj;
            this.$route.meta.title = name;

            [this.firstArray, this.secondArray].forEach(item=>this.getData(item));
            this.getSingleData();

            //获取告警
            this.getEquipAlaramList();

            // 集中器33 or 电缆桩40 时有实时数据
            this.$nextTick(res=>{
                this.hasCurrentandHistory({
                    deviceAdress,
                    deviceType
                })
            })
        },
        destroyed () {
            this.client && this.client.end();
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
                "exportOherHistoryData"
            ]),
            ...mapActions('overall',[
                'getGeocode',
                'getAlarmList'
            ]),
            //获取数据
            getData(target) {
                const obj = this.equipObj;
                for(let item in obj){
                    target.forEach(k=>{
                        if(item === k.sign){
                            k.value = obj[item];
                        }
                    })
                }
            },
            
            //获取个别信息
            getSingleData(){
                const { parentType , parentName , longitude , latitude , location , createTime , imageUrls } = this.equipObj;
                this.single = {...this.equipObj};
                //匹配魔节or集中器
                parentType&&parentType ==='30'?this.single.magicName =parentName :this.single.concenName =parentName;
                //设备经纬度
                this.single.position = [(longitude || 113.991244) ,(latitude || 113.991244)];
                //设备地址,原格式[xx,xx,xx]
                this.single.location = (location&&location.split(',').join('')) || 'xxx';
                //设备创建时间
                this.single.createTime = this.$moment(createTime).format('YYYY-MM-DD HH:mm:ss');
                //设备视图
                this.imageUrls = imageUrls || [];
            },

            // 有实时数据以及历史数据(现仅用于集中器 & 定位桩)
            hasCurrentandHistory( params ){
                const { deviceType } = params;
                
                if( deviceType != 33 && deviceType != 40 )  return;

                this.getDeviceCurrentData();

                this.mqttConnection();

                // 判断是集中器还是定位桩类型
                this.value = deviceType == 33 ? "v" : "batteryV"; 

                // 获取历史数据
                this.getDeviceHistoryData();
                
            },
            //切换日期
            changeDate(date){
                if( !date )return;
                this.time = [ date[0], date[1] ];
                this.getDeviceHistoryData();
            },
            //切换环境变量
            changeParam(val){
                this.value = val;
                this.getDeviceHistoryData();
            },

            // 获取最后一条数据(实时数据)
            getDeviceCurrentData(){
                const { deviceAdress, deviceType } = this.equipObj;

                this.getOtherCurrentData({
                    deviceAddress: deviceAdress,
                    deviceType
                }).then(res=>{
                    if(!res) return;
                    const { dataMap } = res;

                    if( !Object.keys(dataMap).length ) return;

                    this.device_data = {
                        ...dataMap[deviceAdress],
                        createTime:this.$moment(dataMap[deviceAdress].createTime).format('YYYY-MM-DD HH:mm:ss')
                    }
                })
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
                        illumination:{ keyValue: data.illumination || null },
                        inclination:{ keyValue: data.inclination || null },
                        batteryV:{ keyValue: data.batteryV || null }
                    }

                    if(fc == 40 && data.inclination && (data.inclination != this.single.remark2)){
                        this.single = {
                            ...this.single,
                            remark2: data.inclination
                        }
                    }
                })
            },

            // 获取设备历史数据
            getDeviceHistoryData(){
                const { deviceAdress, deviceType } = this.equipObj;
                const [ startTime, endTime ] = this.time;

                const lineChart = this.$refs.lineChart && this.$refs.lineChart.chart;
                lineChart.showLoading({ text: '数据加载中...', color: '#4cbbff', textColor: '#4cbbff', maskColor: 'rgba(0, 0, 0, 0.9)' });
                this.loading = true;

                this.getOtherHistoryData({
                    deviceAddress: deviceAdress,
                    deviceType,
                    startTime,
                    endTime,
                    key:this.value
                }).then(res=>{
                    if( !res ) return;

                    const { dataMap, deviceInfoList } = res;
                    if( !deviceInfoList.length )return;

                    const { result, timeResult } = lastDataFilter({
                        list:deviceInfoList,
                        data:dataMap,
                        startTime,
                        endTime
                    });

                    this.timeArray = timeResult;
                    this.currentValue = result;
                }).finally(res=>{
                    lineChart.hideLoading();
                    this.loading = false;
                })
            },

            //下载
            download: _.throttle(function(){
                const { deviceAdress, deviceType } = this.equipObj;
                const msg = this.$message({
                    iconClass:"el-icon-loading",
                    dangerouslyUseHTMLString: true,
                    message:`<strong class="loadingMsg">历史数据下载中...</strong>`,
                    duration:0
                });
                const [ startTime, endTime ] = this.time;
                this.exportOherHistoryData({
                    deviceAddress:deviceAdress,
                    startTime,
                    endTime,
                    key:this.value
                }).then(res=>{
                    if(!res)return;
                    downFile(res);
                }).finally(i=>{
                    msg.close();
                })
            },5000),

            // 获取告警列表
            getEquipAlaramList(){
                this.alarmLoading = true;
                const { deviceAdress } = this.equipObj;
                this.getAlarmList({
                    current:1,
                    size:20,
                    status:null,
                    projectId:this.projectId,
                    filterStr:deviceAdress
                }).then(res=>{
                    if(!res)return;
                    this.alarmList = res.data;
                }).finally(res=>{
                    this.alarmLoading = false;
                })
            }
        },
    }
</script>

<style lang="scss">
    .el-collapse-item__header{
        font-size: 15px;
        font-weight: bold;
        color: #3182cb;
        height: 40px;
        line-height: 40px;
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
                p{
                    display: flex;
                    align-items: center;
                    margin: 15px 0 ;    
                    strong{
                        flex:0.8;
                    }
                    span{
                        flex:2;
                        .el-image{
                            width: 5rem;
                            height: 5rem;
                            margin-right: 10px;
                            border-radius: 5px;
                        }
                    }
                    .red{
                        color: red;
                    }
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