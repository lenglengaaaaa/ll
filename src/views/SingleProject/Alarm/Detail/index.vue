<template>
    <div class="Alarm_Detail">
        <div class="wrap">
            <div class="top">
                <el-divider content-position="left">基本信息</el-divider>
                <div class="intro">
                    <p v-for="item in firstArray" :key="item.sign">
                        <strong>{{item.title}}</strong>
                        <span>{{item.value || '---'}}</span>
                    </p>
                </div>
            </div>
            <div class="center">
                <el-divider content-position="left">从属关系</el-divider>
                <div class="intro">
                    <p v-for="item in secondArray" :key="item.sign">
                        <strong>{{item.title}}</strong>
                        <span>{{item.value || '---'}}</span>
                    </p>
                </div>
            </div>
            <div class="footer">
                <el-divider content-position="left">告警详情</el-divider>
                <div class="intro">
                    <p>
                        <strong>告警时间</strong>
                        <span>{{single.createTime}}</span>
                    </p>
                    <p>
                        <strong>告警地址</strong>
                        <span>{{single.location}}</span>
                    </p>
                    <p>
                        <strong>告警详情</strong>
                        <span class="red">
                            {{single.alarmMsg}}
                        </span>
                    </p>
                    <p v-if="single.isshock">
                        <strong>设备经纬度</strong>
                        <span >
                            {{xy}}
                        </span>
                    </p>
                    <!-- <p v-if="!single.status">
                        <strong>告警处理</strong>
                        <span>
                            <el-button 
                                type="primary" 
                                size="small" 
                                v-for="item in btns" 
                                :key="item.value" 
                                @click="handle(item.value,item.label)"
                            >
                                {{item.label}}
                            </el-button>
                        </span>
                    </p> -->
                    <!-- <p v-else>
                        <strong>处理详情</strong>
                        <span>
                            {{single.details || "---"}}
                        </span>
                    </p> -->
                </div>
            </div>
            <div>
                <cc-mapSingle 
                    v-if="success"
                    vid="alarm"
                    :deviceParams="single"
                    :hasSearch="false"
                    :hasClick="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { request } from '@/utils/Request';
    import { api } from '@/utils/API';
    import { xyTransformation } from '@/utils/methods'
    
    export default {
        data() {
            return {
                firstArray:[
                    {title:'设备名称',sign:'deviceName',value:''},
                    {title:'设备EUI',sign:'deviceEui',value:''},
                    {title:'设备地址域',sign:'deviceAdress',value:''},
                ],
                secondArray:[
                    {title:'所属台区',sign:'courtsName',value:''},
                    {title:'所属配电房',sign:'roomName',value:''},
                    {title:'所属配电柜',sign:'chestName',value:''},
                    {title:'所属井盖',sign:'trapName',value:''},
                    {title:'所属线缆',sign:'lineName',value:''},
                ],
                btns:[
                    {value:1,label:'已处理'},
                    {value:2,label:'不予处理'},
                    {value:3,label:'延期处理'},
                ],
                single:{},
                success:false
            }
        },
        mounted () {
            this.getDetail();
        },
        computed: {
            alarmObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            },
            xy(){
                return this.single.position.join(',')
            }
        },
        methods: {
            ...mapActions('overall',[
                'getAlarmDetail',
                'handleAlarm'
            ]),
            /**
             * 获取装置详情
             */
            getDeviceDetail(){
                const { deviceId, type } = this.equipObj;
                request({
                    url:`${api.getDeviceDetail}?id=${deviceId}&deviceType=${type}`,
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
            //处理回调
            // handle(val,label){
            //     const {id,type} = this.alarmObj;
            //     this.$prompt(`该告警处理为 " ${label} " ,请输入处理详情`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         inputType:'textarea',
            //     }).then(({ value }) => {
            //         this.handleAlarm({
            //             status:val,
            //             details:value,
            //             warningId:id,
            //             type
            //         }).then(res=>{
            //             if(!res)return;
            //             this.$router.push({name:'AlarmList'})
            //         })
            //     }).catch(() => {});
            // },
        },
    }
</script>

<style lang="scss" scoped>
    .Alarm_Detail{
        display: flex;
        justify-content: center;
        .wrap{
            border-radius: 5px;
            padding: 0 20px 20px 20px;
            width: 1200px;
            max-width: 100%;
            overflow: auto;
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) ;
            font-size: 0.75rem;
            .el-divider--horizontal{
                margin: 28px 0;
            }
            .intro{
                p{
                    display: flex;
                    align-items: center;
                    margin: 15px 0 ;    
                    strong{
                        flex:0.5;
                    }
                    span{
                        flex:2;
                    }
                    .red{
                        color: red;
                    }
                }
            }
        }
    }
</style>