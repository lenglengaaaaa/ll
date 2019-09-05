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
                    <p v-if="!single.status">
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
                    </p>
                    <p v-else>
                        <strong>处理详情</strong>
                        <span>
                            {{single.details}}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <MapSingle 
                    vid="alarm"
                    :position="single.position"
                    :hasSearch="false"
                    :hasClick="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { MapSingle } from '@/components/Maps'
    import { mapActions } from 'vuex'
    
    export default {
        components: {
            MapSingle,
        },
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
                single:{}
            }
        },
        created () {
            const {longitude,latitude} = this.alarmObj;
            this.single.position = [ longitude|| 113.991244 , latitude||22.5959 ];
        },
        mounted () {
            this.getDetail();
        },
        computed: {
            alarmObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        methods: {
            ...mapActions('overall',[
                'getAlarmDetail',
                'handleAlarm'
            ]),
            getDetail(){
                const {id,type} = this.alarmObj;
                this.getAlarmDetail({
                    id,type
                }).then(res=>{
                    if(!res)return;
                    this.getData(res,this.firstArray);
                    this.getData(res,this.secondArray);
                    this.single ={
                        createTime:this.$moment(res.createTime).format('YYYY-MM-DD HH:mm:ss'),
                        location:res.location || '---',
                        alarmMsg:res.decodeHex,
                        status:res.status,
                        details:res.details || ''
                    }
                })  
            },
            //处理回调
            handle(val,label){
                const {id,type} = this.alarmObj;
                this.$prompt(`该告警处理为 " ${label} " ,请输入处理详情`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType:'textarea',
                }).then(({ value }) => {
                    this.handleAlarm({
                        status:val,
                        details:value,
                        warningId:id,
                        type
                    }).then(res=>{
                        if(!res)return;
                        this.$router.push({name:'AlarmList'})
                    })
                }).catch(() => {});
            },
            //获取数据
            getData(res,target) {
                for(let item in res){
                    target.forEach(k=>{
                        if(item === k.sign){
                            k.value = res[item];
                        }
                    })
                }
            },
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
            overflow: scroll;
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