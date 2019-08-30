<template>
    <div class="EQUIP_CONTAINER">
        <div class="magic"> 
            <div class="title">
                <span>魔节环境数据</span>
                <el-select v-model="magicId" @change="changeMagic" v-if="magicList.length>1">
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
                        :magicData="magicData.data"
                        :assetType="assetType"
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
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="s800">
            <div class="title">
                <span>红外、烟雾、液位等传感器</span>
                <el-divider></el-divider>
                <div class="content">
                    <div class="wrap">
                        <Sensor
                            :assetType="assetType"
                            :sensorData="sensorData"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Magic,Tline,S800,Sensor} from './components'
    import {magicDefault,lineDefault,s800Default,sensorDefault} from './components/defaultVal'
    import { mapActions } from 'vuex'
    import Empty from '@/components/Empty'

    export default {
        components: {
            Magic,
            Tline,
            S800,
            Sensor,
            Empty
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
                params:{
                    trapId:null,
                    roomId:null,
                    chestId:null,
                    deviceType:30
                },
                magicData:magicDefault,
                lineData:[],
                sEightData:s800Default(),
                sensorData:sensorDefault,
                client:null
            }
        },
        async created () {
            await this.classifyType(this.assetType)
            await this.getMagicList();
            await this.getLineData();
            await this.getS800Data();
            await this.getSensorData();
        }, 
        mounted () {
            this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
            this.$mqtt.listen(this.client,res=>{
                console.log(res,'设备数据')
                const {address,data,dataType,fc,time,lineId} = res;
                const type = this.classifyDevice(fc);
                if(!type)return;
                //1:魔节,2:线缆,3:s800,4:独立传感
                if(type===1){
                    if(this.currentMagic.address===address){
                        const magic = this.magicData;
                        magic.createTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                        let obj = {};
                        for(let i in data){
                            if(data[i]!=='--'){
                                obj[i] = {
                                    value:data[i],
                                    createTime:moment(time).format('YYYY-MM-DD HH:mm:ss')
                                }
                            }
                        }
                        magic.data = {...magic.data,...obj};
                    }
                }
                if(type===2){
                    const line = this.lineData.filter(item=>item.id==lineId)[0];
                    if(!line)return;
                    line.createTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                    let obj = {};
                    for(let i in data){
                        if(data[i]!=='--'){
                            obj[i] = {
                                value:data[i],
                                createTime:moment(time).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    }
                    line.data = {...line.data,...obj}
                }
                if(type===3){
                    const sEight = this.sEightData.filter(item=>item.id==address)[0];
                    if(!sEight)return;
                    sEight.createTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                    let obj = {};
                    for(let i in data){
                        if(data[i]!=='--'){
                            obj[i] = {
                                value:data[i],
                                createTime:moment(time).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    }
                    sEight.data = {...sEight.data,...obj}
                }
                if(type===4){
                    const sensor = this.sensorData.filter(item=>item.address==address)[0];
                    if(!sensor)return;
                    sensor.createTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                    let obj = {};
                    for(let i in data){
                        if(data[i]!=='--'){
                            obj[i] = {
                                value:data[i],
                                createTime:moment(time).format('YYYY-MM-DD HH:mm:ss')
                            }
                        }
                    }
                    sensor.data = {...sensor.data,...obj}
                }
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
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            ...mapActions('equip',[
                'getEquipMenu',
                'getCurrentMagicData',
                'getLineCurrentData',
                'gets800CurrentData',
                'getSensorCurrentData'
            ]),
            //获取资产下魔节列表
            getMagicList(){
                const {id} = this.assetObj;
                this.getEquipMenu(this.params).then(res=>{
                    if(!res)return;
                    this.magicList = res;
                    if(res.length){
                        this.currentMagic = res[0];
                        this.magicId = res[0].id;
                        this.getMagicData( res[0].id);
                    }
                })
            },
            //获取实时魔节数据
            getMagicData(queryId){
                const {id} = this.assetObj;
                this.getCurrentMagicData({
                    queryId,
                    assetId:id,
                    assetType:this.assetType
                }).then(res=>{
                    if(!res){
                        this.magicData = {};
                        return
                    }
                    this.magicData= {
                        data:this.filterData(res,'magic'),
                        createTime:res.createTime&&this.$moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')
                    };
                })
            },
            //获取线缆实时数据
            getLineData(){
                const {id} = this.assetObj;
                this.getLineCurrentData(id).then(res=>{
                    if(!res)return;
                    const {lineInfoList,lineDateMap} = res;
                    if(!lineInfoList.length){
                        this.lineData = lineDefault();
                        return;
                    }
                    this.lineData = this.dataProcessing(lineInfoList,lineDateMap,'line');
                })
            },
            //获取S800实时数据
            getS800Data(){
                const {id} = this.assetObj;
                this.gets800CurrentData({
                    assetId:id,
                    assetType:this.assetType
                }).then(res=>{
                    if(!res) return;
                    const {deviceInfoList,dataMap} = res;
                    if(!deviceInfoList.length){
                        this.sEightData = s800Default();
                        return;
                    }
                    this.sEightData = this.dataProcessing(deviceInfoList,dataMap,'s800');
                })
            },
            //获取资产下的s801、s802、s803实时数据
            getSensorData(){
                const {id} = this.assetObj;
                this.getSensorCurrentData({
                    assetId:id,
                    assetType:this.assetType
                }).then(res=>{
                    if(!res)return;
                    const {deviceInfoList,dataMap} = res;
                    if(!deviceInfoList.length)return;
                    const names = deviceInfoList.reduce((pre,current)=>{
                        pre[current.deviceType] = {};
                        pre[current.deviceType][current.deviceAdress] = current.name;
                        return pre
                    },{})
                    let result = [];
                    for(let i in dataMap){
                        const item = dataMap[i];
                        for(let k in item){
                            const name = names[i][k];
                            result.push({
                                address:k,
                                name,
                                createTime:item[k].createTime&&this.$moment(item[k].createTime).format('YYYY-MM-DD HH:mm:ss'),
                                data:this.filterData(item[k],'s800')
                            })
                        }
                    }
                    this.sensorData = result;
                })
            },
            //切换魔节回调
            changeMagic(val){
                this.currentMagic = this.magicList.filter(item=>item.id ===val)[0];
                this.getMagicData(val);
            },
            //数据处理
            dataProcessing(list,dataMap,type){
                const names = list.reduce((pre,current)=>{
                    const params = type==='line'?current.id:current.deviceAdress;
                    pre[params] = current.name;
                    return pre
                },{})
                let result = [];
                for(let i in dataMap){
                    const name = names[i];
                    result.push({
                        id:i,
                        name,
                        createTime:dataMap[i].createTime&&this.$moment(dataMap[i].createTime).format('YYYY-MM-DD HH:mm:ss'),
                        data:this.filterData(dataMap[i],type)
                    })
                }
                return result;
            },
            //数据筛选
            filterData(res,type){
                const arr = {
                    'magic':['temp','hum','o2','h2s','co','ch4','o3','bat'],
                    'line':['batteryA','CBTemp','lineA','lineTemp','lineV','node433','shake','signal'],
                    's800':['co','infrared','liquid','batteryA','shake','node433','signal','CBTemp'],
                }
                let obj = {};
                for(let i in res){
                    if(i==='creatTime')break;
                    if(arr[type].includes(i)){
                        obj[i] = {
                            value:res[i].value,
                            createTime:res[i].createTime&&this.$moment(res[i].createTime).format('YYYY-MM-DD HH:mm:ss')
                        };
                    }
                }
                return obj;
            },
            //匹配资产类型
            classifyType(type){
                const {id} = this.assetObj; 
                switch (type) {
                    //配电柜
                    case 0:
                        return this.params.chestId = id;
                    //配电房
                    case 1:
                        return this.params.roomId = id;
                    //井盖 2
                    default:
                        return this.params.trapId = id;
                }
            },
            //设备分类
            classifyDevice(id){
                switch (+id) {
                    //集中器(剔除)
                    case 33:
                        return false;
                    //魔戒('剔除')
                    case 36:
                        return false;
                    //魔节
                    case 30:
                        return 1;
                    //线缆温度传感器
                    case 38:
                        return 2;
                    //S800
                    case 28:
                        return 3;
                    //独立传感器
                    default:
                        return 4;
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
    }
</style>