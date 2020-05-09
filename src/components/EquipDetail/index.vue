<template>
    <div class="Equip_Detail">
        <i 
            class="el-icon-back"
            @click="close"
            v-if="hasClose"
        />
        <div class="wrap">
            <div class="top">
                <el-divider content-position="left">基本信息</el-divider>
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
            <div class="center">
                <el-divider content-position="left">从属关系</el-divider>
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
            <div class="center" v-if="equipObj.deviceType == 33">
                <el-divider content-position="left">实时数据</el-divider>
                <div class="intro">
                    <p>
                        <strong>上报时间 :</strong>
                        <span :style="{fontWeight:'bold'}">
                            {{ concentrator_data && concentrator_data.createTime || '---'}}
                        </span>
                    </p>
                    <p>
                        <strong>电压(V)</strong>
                        <span :style="{fontWeight:'bold'}">
                            {{
                                `${(concentrator_data && concentrator_data.v &&concentrator_data.v.keyValue) || '---'} A`
                            }}
                        </span>
                    </p>
                    <p>
                        <strong>信号强度(dbm)</strong>
                        <span :style="{fontWeight:'bold'}">
                            {{
                                `${(concentrator_data && concentrator_data.signalNB &&concentrator_data.signalNB.keyValue) || '---'} dbm`
                            }}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <cc-mapSingle 
                    vid="alarmDetail"
                    :position="single.position"
                    :hasSearch="false"
                    :hasClick="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

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
        data() {
            return {
                firstArray:[
                    {title:'设备类型',sign:'typeName',value:''},
                    {title:'设备名称',sign:'name',value:''},
                    {title:'设备EUI',sign:'deviceEui',value:''},
                    {title:'设备编号',sign:'number',value:''},
                    {title:'设备地址域',sign:'deviceAdress',value:''},
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
                client:null
            }
        },
        created () {
            const { name, deviceAdress, deviceType } = this.equipObj;

            this.$route.meta.title = name;
            [this.firstArray, this.secondArray].forEach(item=>this.getData(item));
            this.getSingleData();

            if( deviceType == 33) this.isConcentrator(deviceAdress);
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
            ...mapActions('equip',[
                'getConcentratorCurrent',
            ]),
            //如果是类型是集中器
            isConcentrator(deviceAdress){
                //通过接口获取实时数据
                this.getConcentratorCurrent({
                    deviceAddress: deviceAdress
                }).then(res=>{
                    if(!res) return;
                    const { dataMap } = res;

                    if( !Object.keys(dataMap).length ) return;
                    this.concentrator_data = {
                        ...dataMap[deviceAdress],
                        createTime:this.$moment(dataMap[deviceAdress].createTime).format('YYYY-MM-YY HH:mm:ss')
                    };
                })

                //通过Mqtt获取实时数据
                this.client = this.$mqtt.connect(`topic_data_${this.projectId}`);
                this.$mqtt.listen(this.client,res=>{
                    const { data, fc, address, time } = res;
                    if( fc != 33 || address != deviceAdress ) return;
                    console.log(res,'集中器数据')
                    this.concentrator_data = {
                        createTime:this.$moment(time).format('YYYY-MM-DD HH:mm:ss'),
                        signalNB:{ 
                            keyValue:data.signalNB 
                        },
                        v:{ 
                            keyValue:data.v 
                        }
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
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
        }
    }
</style>