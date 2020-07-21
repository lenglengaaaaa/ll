<template>
    <div class="EQUIP_CONTAINER">
        <div class="magic" v-if="hasMagic || hasLine"> 
            <div class="title">
                <span>魔节环境数据</span>
                <el-select v-model="magicId" filterable @change="changeMagic">
                    <el-option
                        v-for="item in magicList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
                <el-divider></el-divider>
                <p>
                    <span>数据上传时间 :&nbsp;</span>
                    <strong>{{magicData.createTime || "---"}}</strong>
                </p>
            </div>
            <div class="content">
                <div class="wrap">
                    <Magic
                        :loading="loading"
                        :magicData="magicData.data"
                        :assetType="assetType"
                        :currentMagic="currentMagic"
                    />
                </div>
            </div>
        </div>
        <div class="line" v-if="hasLine">
            <div class="title">
                <span>线缆温度传感器</span>
                <el-divider></el-divider>
                <div class="content">
                    <div class="wrap">
                        <Tline 
                            :lineLoading="line_loading"
                            :lineData="lineData"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="s800">
            <div class="title">
                <span>S800传感器平台</span>
                <el-divider></el-divider>
                <div class="content">
                    <div class="wrap">
                        <S800
                            :sEightData="sEightData"
                            :assetType="assetType"
                            :s800Loading="s800_loading"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="s800">
            <div class="title">
                <span>红外、烟雾、液位等传感器</span>
                <el-select v-model="sensorType" @change="changeSensor">
                    <el-option label="烟感" value="801" />
                    <el-option label="红外" value="803" />
                    <el-option label="液位" value="805" />
                </el-select>
                <el-divider></el-divider>
                <div class="content">
                    <div class="wrap">
                        <Sensor
                            :sensorData="sensorData"
                            :assetType="assetType"
                            :sensorType="sensorType"
                            :sensorLoading="sensor_loading"
                        />
                    </div>
                </div>
            </div>
        </div>
        <cc-backtop target=".EQUIP_CONTAINER"/>
    </div>
</template>

<script>
    import { Magic ,Tline ,S800 ,Sensor } from './components'
    import { dataProcessing , currentDataFilter} from '@/utils/methods'
    import { mapActions } from 'vuex'

    export default {
        components: {
            Magic,
            Tline,
            S800,
            Sensor,
        },
        props: {
            assetType: Number,
            hasLine:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                magicList:[],
                currentMagic:{},
                magicId:'',
                sensorType:'801',
                params:{
                    trapId:null,
                    roomId:null,
                    chestId:null,
                    deviceType:30
                },
                magicData:{},
                lineData:[],
                sEightData:[],
                sensorData:[],
                client:null,
                loading:false,
                hasMagic:true,
                line_loading:false,
                sensor_loading:false,
                s800_loading:false
            }
        },
        created () {
            Promise.all([
                this.classifyType(this.assetType),
                this.getMagicList(),
                this.hasLine && this.getLineData(),
                this.getS800Data(),
                this.getSensorData()
            ])
        }, 
        mounted () {
            if(!this.projectId)return;
            this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
            this.$mqtt.listen(this.client,res=>{
                console.log(res,'设备数据')
                this.mqttDataHandle(res)
            });
        },
        destroyed () {
            this.client&&this.client.end();
        },
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            },
            projectId(){
                return sessionStorage.getItem('project')&&JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            ...mapActions('equip',[
                'getEquipMenu',
                'getCurrentMagicData',
                'getLineCurrentData',
                'gets800CurrentData',
                'getS801CurrentData',
                'getS803CurrentData',
                'getS805CurrentData',
            ]),
            //获取资产下魔节列表
            getMagicList(){
                this.getEquipMenu(this.params).then(res=>{
                    if(!res)return;
                    this.magicList = res;
                    if(res.length){
                        this.currentMagic = res[0];
                        this.magicId = res[0].id;
                        this.getMagicData( res[0].id);
                    }else{
                        this.hasMagic = false;
                    }
                })
            },
            //获取实时魔节数据
            getMagicData(queryId){
                this.loading = true;
                const {id,trapId} = this.assetObj;
                this.getCurrentMagicData({
                    queryId,
                    assetId:trapId||id,
                    assetType:this.assetType
                }).then(res=>{
                    if( !res ){
                        this.magicData = {};
                        return;
                    };
                    this.magicData= {
                        data:currentDataFilter(res,'magic'),
                        createTime:res.createTime&&this.$moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')
                    };
                }).finally(res=>{
                    this.loading = false;
                })
            },
            //获取线缆实时数据
            getLineData(){
                this.line_loading = true;
                const { id, trapId } = this.assetObj;
                this.getLineCurrentData(trapId||id).then(res=>{
                    const { lineInfoList, lineDateMap } = res;
                    if( !res || !lineInfoList.length || !lineDateMap )return;
                    this.lineData = dataProcessing(lineInfoList,lineDateMap);
                }).finally(res=>{
                    this.line_loading = false;
                })
            },
            //获取S800实时数据
            getS800Data(){
                this.s800_loading = true;
                const {id,trapId} = this.assetObj;
                this.gets800CurrentData({
                    assetId:trapId||id,
                    assetType:this.assetType
                }).then(res=>{
                    const {deviceInfoList,dataMap} = res;
                    if( !res || !deviceInfoList.length ) return;
                    this.sEightData = dataProcessing(deviceInfoList,dataMap,'s800');
                }).finally(res=>{
                    this.s800_loading = false;
                })
            },
            //获取资产下的红外、烟感等设备实时数据
            getSensorData(){
                this.sensor_loading = true;
                const {id,trapId} = this.assetObj;
                const params = { assetId:trapId || id, assetType:this.assetType };
                const func = {
                    '801':this.getS801CurrentData,
                    '803':this.getS803CurrentData,
                    '805':this.getS805CurrentData,
                }
                func[this.sensorType](params).then(res=>{
                    const {deviceInfoList,dataMap} = res;
                    if( !res || !deviceInfoList.length )return;
                    this.sensorData = dataProcessing(deviceInfoList,dataMap,'sensor');
                }).finally(res=>{
                    this.sensor_loading = false;
                })
            },
            //MQTT数据处理
            mqttDataHandle(res){
                const { address, lineId, fc, data, time } = res;
                if( fc==33 || fc==36 )return;
                //筛选数据
                const filterData = (currentVal)=>{
                    if(!currentVal)return;
                    currentVal.createTime = this.$moment(time).format('YYYY-MM-DD HH:mm:ss');
                    let obj = {};
                    for(let i in data){
                        if(data[i]!=='--'){
                            obj[i] = {
                                value:data[i],
                                createTime:this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    }
                    for(let k in currentVal.data){ 
                        if(obj[k]){
                            currentVal.data[k] = obj[k];
                        }
                    }
                }
                //30:魔节,38:线缆,28:s800,default:独立传感
                switch (+fc) {
                    case 30:
                        if(this.currentMagic.address===address){
                            const magic = this.magicData;
                            filterData(magic);
                        }
                        break;
                    case 38:
                        const line = this.lineData.filter( item => item.id == lineId )[0];
                        filterData(line);
                        break;
                    case 28:
                        const sEight = this.sEightData.filter( item=> item.deviceAdress == address )[0];
                        filterData(sEight);
                        break;
                    default:
                        const sensor = this.sensorData.filter( item=> item.deviceAdress == address )[0];
                        filterData(sensor);
                        break;
                }
            },
            //切换魔节回调
            changeMagic(val){
                this.currentMagic = this.magicList.filter(item=>item.id ===val)[0];
                this.getMagicData(val);
            },
            //切换传感器回调
            changeSensor(val){
                this.getSensorData(val);
            },
            //匹配资产类型
            classifyType(type){
                const { trapId,id } = this.assetObj;
                switch (type) {
                    //配电柜
                    case 0:
                        return this.params.chestId = id;
                    //配电房
                    case 1:
                        return this.params.roomId = id;
                    //井盖 2
                    default:
                        return this.params.trapId = trapId || id;
                }
            },
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 650px) {
        .EQUIP_CONTAINER{
            .seletGroup{
                .el-form{
                    flex-direction: column;
                }
            }
        }
    }

    .EQUIP_CONTAINER{
        position: relative;
        height: 100%;
        overflow: auto;
        // width: 90%;
        // margin: 0 auto;
        .el-divider--horizontal{
            margin: 20px 0;
            .el-divider__text{
                font-weight: bold;
                font-size:0.8rem;
            }
        }
        .title{
            padding: 10px 0 10px 0;
            >span{
                font-size: 1.2rem;
                font-weight: bold;
                padding: 0 10px;
                border: 0 solid #e4e6eb;
                border-left-width: 5px;
                border-radius: 5px;
                border-left-color: #36a9e1;
            }
            p{
                margin:15px 0;
                display: flex;
                align-items: center;
                span,strong{
                    font-size: 15px;
                }
            }
        }
        .content{
            display: flex;
            justify-content: center;
            .wrap{
                width: 95%;
                background: #fff;
                padding: 20px;
                border-radius: 5px;
                .seletGroup{
                    padding-bottom: 20px;
                    display: flex;
                    // justify-content: space-between;
                    align-items: center;
                    .el-form{
                        width: 100%;
                        display: flex;
                        .el-form-item{
                            padding: 0 10px;
                        }
                    }
                    .el-icon-download{
                        cursor: pointer;
                        background: #ecefef;
                        padding: 10px;
                        border-radius: 5px;
                    }
                }
            }
        }
        .empty{
            height: 350px !important;
        }
    }
</style>