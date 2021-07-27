<template>
    <cc-assetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="魔戒总览" lazy>
                <RingView :switchList="switchList" :switchLoading="loading" />
            </el-tab-pane>
            <!-- <el-tab-pane label="魔戒列表" lazy>
                <RingList :switchList="switchList" :switchLoading="loading" />
            </el-tab-pane> -->
            <!-- <el-tab-pane label="设备列表" lazy>
                <cc-equipList 
                    :data="equipList"
                    :getList="getEquipList"
                />
            </el-tab-pane>  
            <el-tab-pane label="数据视图" lazy>
                <DataDetail :assetType="0"/>
            </el-tab-pane> -->
            <!-- <el-tab-pane label="数据模拟" lazy>
                <Simulate :client ="client" />
            </el-tab-pane>
            <el-tab-pane label="测试" lazy v-if="hasTest">
                <Test :switchList="switchList" />
            </el-tab-pane> -->
        </template>
    </cc-assetDetail>
</template>

<script>
    import { RingView, RingList, Simulate, Test, RFIDview, RFIDList } from './components'
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
                    "deviceName":"占位设备一"
                },
                {
                    "outLineName": "B",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位设备二"
                },
                {
                    "outLineName": "C",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位设备三"
                },
                {
                    "outLineName": "N",
                    "deviceId": null,
                    "data": null,
                    "deviceName":"占位设备四"
                }
            ]
        }
    ]

    export default {
        components: {
            RingView,
            RingList,
            Simulate,
            Test,
            DataDetail,
            RFIDview,
            RFIDList
        },
        data() {
            return {
                // 0: 低压柜 1:中高压
                cabinetType:1,
                equipList:[],
                params:{
                    size:100,
                    current:1,
                    type:1
                },
                switchList:[],
                client:null,
                hasTest: false,
                loading: false
            }
        },
        created () {
            const { id, name, remark1 } =JSON.parse(sessionStorage.getItem("obj"));

            // 设备类型
            this.cabinetType = remark1;

            const userId = this.$store.state.user.userDetail.id;
            this.hasTest = userId == 1 && true;

            this.$route.meta.title = name;

            // this.getRingDetail({
            //     id,
            //     deviceType:remark1==1? 41: 36
            // }).then(res=>{
            //     this.loading = true;
            //     if(!res )return;
            //     const { switchList } = res;
            //     const filtered = switchList.length && switchList.map(item=>{
            //         if( item.outLineList && item.outLineList.length){
            //             item.outLineList = this._.sortBy(item.outLineList,'outLineName');
            //         }
            //         return item;
            //     })
            //     this.switchList = filtered && filtered.length ? filtered : defaultValue;
            // }).finally(res=>{
            //     this.loading = false;
            // })
            
            // this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
            // this.$mqtt.listen(this.client,res=>{
            //     const { data, fc, address, time } = res;
            //     let outLine;
            //     for(let item of this.switchList){
            //         outLine = item.outLineList.filter(k => k.deviceAdress === address )[0];
            //         if(outLine)break;
            //     }

            //     if( (fc != 36 && fc != 41) || !outLine ) return;
            //     // if( (fc == 36 || fc == 41 ) && outLine ){
            //         console.log( res, fc==36?'魔戒数据':"RFID数据" );
                
            //         outLine.data ={
            //             createTime:this.$moment(time).format('YYYY-MM-DD HH:mm:ss'),
            //             decodeHex:{
            //                 ...outLine.data ? outLine.data.decodeHex : {},
            //                 ...typeof data === 'string'?JSON.parse(data) : data
            //             }
            //         }
            //     // }
                
            // })
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