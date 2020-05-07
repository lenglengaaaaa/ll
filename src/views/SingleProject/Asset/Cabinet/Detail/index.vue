<template>
    <cc-assetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="魔戒总览" lazy>
                <RingView
                    :switchList="switchList"
                />
            </el-tab-pane>
            <el-tab-pane label="魔戒列表" lazy>
                <RingList 
                    :switchList="switchList"
                />
            </el-tab-pane>
            <el-tab-pane label="设备列表" lazy>
                <cc-equipList 
                    :data="equipList"
                    :getList="getEquipList"
                />
            </el-tab-pane>  
            <el-tab-pane label="数据视图" lazy>
                <DataDetail
                    :assetType="0"
                />
            </el-tab-pane>
            <el-tab-pane label="数据模拟" lazy>
                <Simulate 
                    :client ="client"
                />
            </el-tab-pane>
            
        </template>
    </cc-assetDetail>
</template>

<script>
    import RingView from './components/RingView'
    import RingList from './components/RingList'
    import Simulate from './components/Simulate'
    import DataDetail from '@/components/DataDetail'
    import { mapActions } from 'vuex'

    const defaultValue  = [
        {
            "switchId": null,
            "switchName": "占位出线一",
            "outLineList": [
                {
                    "outLineName": "A",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位魔戒一"
                },
                {
                    "outLineName": "B",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位魔戒二"
                },
                {
                    "outLineName": "C",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位魔戒三"
                },
                {
                    "outLineName": "N",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位魔戒四"
                }
            ]
        }
    ]

    export default {
        components: {
            RingView,
            RingList,
            Simulate,
            DataDetail
        },
        data() {
            return {
                equipList:[],
                params:{
                    size:100,
                    current:1,
                    type:1
                },
                switchList:defaultValue,
                client:null
            }
        },
        created () {
            const { id, name } =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title = name;

            this.getRingDetail(id).then(res=>{
                if(!res )return;
                const { switchList } = res;
                const filtered = switchList.length && switchList.map(item=>{
                    if( item.outLineList && item.outLineList.length){
                        item.outLineList = this._.sortBy(item.outLineList,'outLineName');
                    }
                    return item;
                })
                this.switchList = filtered && filtered.length ? filtered : defaultValue;
            })
            
            this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
            this.$mqtt.listen(this.client,res=>{
                const { data, fc, address, time } = res;
                if( fc != 36 )return;
                console.log(res,'魔戒数据')
                let outLine;
                for(let item of this.switchList){
                    outLine = item.outLineList.filter(k => k.deviceAdress === address )[0];
                    if(outLine)break;
                }
                if(!outLine)return;
                outLine.data ={
                    createTime:this.$moment(time).format('YYYY-MM-DD HH:mm:ss'),
                    dataJSON:{
                        ...outLine.data.dataJSON,
                        ...typeof data === 'string'?JSON.parse(data) : data
                    }
                }
            })
        },
        destroyed () {
            this.client&&this.client.end();
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            }
        },
        methods: {
            ...mapActions('equip',[
                'getEquipInAsset',
                'getRingDetail'
            ]),
            //获取设备列表
            getEquipList(chestId){
                return this.getEquipInAsset({
                    ...this.params,
                    chestId
                }).then(res=>{
                    if(!res)return;
                    this.equipList = res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>