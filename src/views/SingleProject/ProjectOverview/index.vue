<template>
    <div class="pjOverdiv">
        <div class="wrap">
            <!-- 设备运行统计 -->
            <div class="alarm_info" @click="outerVisible = true">
                <div class="title">设备运行统计</div>
                <div class="value">
                    <div v-for="(item, index) in equipmentAlarmCount" :key="index" class="info">
                        <div class="info_top">
                            <div class="point" :style="{ background: item.color }" />
                            <div class="name">{{ item.name }}</div>
                            <div class="num">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <cc-map 
                :marker="marker"
                vid="apply"
                :zoom="19"
                hasUpdate
            />

            <!-- 低压设备从属关系图如果 -->
            <div class="relation_btn">
                <el-button type="primary"  @click="relationVisible = true">低压设备从属关系</el-button>
            </div>
        </div>

        <el-dialog title="设备运行统计详情" :visible.sync="outerVisible" v-if="outerVisible">
            <el-dialog
                width="50%"
                title="设备告警列表"
                :visible.sync="innerVisible"
                v-if="innerVisible"
                append-to-body
            >
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                    stripe
                >   
                    <el-table-column
                        prop="parentName"
                        label="告警设备"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="告警装置"
                        align="center"
                    >
                        <!-- <template slot-scope="scope">
                            <el-link 
                                type="primary" 
                                @click="skipToDetail(scope.row)" 
                                :underline="false"
                            >
                                {{scope.row.name}}
                            </el-link>
                        </template> -->
                    </el-table-column>

                    <el-table-column
                        label="告警内容"
                        align="center"
                    >
                        <template slot-scope="scope" >
                            <span class="red">
                                {{ scope.row.prompt }}{{ scope.row.prompt.length?'相':'' }}{{scope.row.typeName}}{{ noHasDecodeHex(scope.row.typeCode)?'' : scope.row.decodeHex }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <div>
                <BarChart
                    :bar_data="bar_data"
                    :clickBar="clickBar"
                ></BarChart>
            </div>
        </el-dialog>

        <el-dialog title="低压设备从属关系" :visible.sync="relationVisible" v-if="relationVisible" width="80%" top="2%">
            <div>
                <TreeChart
                    :tree_data="tree_data"
                ></TreeChart>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { BarChart, TreeChart } from '@/components/Charts'
    import { request } from '@/utils/Request'
    import { api } from '@/utils/API'
    import { mapActions, mapState } from 'vuex'
    
    export default {
        components: {
            BarChart,
            TreeChart
        },
        data() {
            return {
                marker:[],
                equipmentAlarmCount:{},

                outerVisible: false,
                innerVisible: false,
                relationVisible: false,

                bar_data:{},
                barAdressList:{},
                tableData: [],
                
                tree_data:{},
            }
        },
        mounted () {
            this.getSingleEquipmentAlarm();
            this.getLowTensionTree();
            this.getLocation();
            this.getAlarnInfo();
        },
        computed: {
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            project(){
                return JSON.parse(sessionStorage.getItem('project'));
            },
        },
        methods: {
            ...mapActions('overall',[
                'getMapLabel',
                "getCountEquipmentTotal"
            ]),
            // skipToDetail(row){
            //     sessionStorage.setItem('equipObj',JSON.stringify({
            //         ...row,
            //         id:row.deviceId,
            //         assetsCode:row.deviceAdress
            //     }))
            //     this.$router.push({name:'EquDetail',params:{ equipId:row.deviceId }})
            // },
            clickBar(name){
                this.innerVisible = true;
                this.getEquipmentAlarmList(name)
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
            /**
             * 获取设备告警总数不同设备告警数量详情
             */
            getSingleEquipmentAlarm(){
                request({
                    url:`${api.getSingleEquipmentAlarm}?projectId=${this.projectId}`,
                    method:"get"
                }).then(res=>{
                    if( res && res.data ){
                        let barAdressList= {};

                        const result = res.data.reduce((pre,cur)=>{
                            pre.name.push(cur["typeName"]);
                            pre.normalData.push(cur["totalNormal"]==0? "" : cur["totalNormal"]);
                            pre.earlyWarningData.push(cur["totalEarlyWarn"]==0? "" : cur["totalEarlyWarn"]);
                            pre.alarmData.push(cur["totalAlarm"]==0? "" : cur["totalAlarm"])
                            barAdressList[cur["typeName"]] = cur["adressList"];
                            return pre;
                        },{
                            name:[],
                            normalData:[],
                            earlyWarningData:[],
                            alarmData:[]
                        })

                        this.bar_data = result;
                        this.barAdressList = barAdressList;
                    }
                })
            },
            /**
             * 设备告警统计详情---详情列表
             */
            getEquipmentAlarmList(name){
                let addresses = this.barAdressList[name].join(",");

                request({
                    url:`${api.getEquipmentAlarmList}?projectId=${this.projectId}&addresses=${addresses||""}`,
                    method:"get"
                }).then(res=>{
                    if( res && res.data ){
                        this.tableData = res.data;
                    }else{
                        this.tableData = [];
                    }
                })
            },
            //获取设备的经纬度、位置信息
            getLocation(){
                this.getMapLabel(this.projectId).then(res=>{
                    if(!res)return;
                    let { roomList=[], trapList=[], pileList=[] } = res;
                    let markers = [ ...roomList || [], ...trapList || [], ...pileList || [] ];
                    this.marker = markers;
                })
            },
            // 告警
            getAlarnInfo(){
                this.getCountEquipmentTotal(this.projectId).then(res=>{
                    if(!res)return;
                    const { totalAlarm, totalEarlyWarn, totalNormal } = res;
                    this.equipmentAlarmCount = {
                        normal:{value: totalNormal, name: '正常', color:'green'},
                        earlyWarn:{value: totalEarlyWarn, name: '预警', color:'yellow'},
                        alarm:{ value:totalAlarm , name:"告警" , color:'red'}
                    }
                })
            },
            // 获取低压树
            getLowTensionTree(){
                let project = JSON.parse(JSON.stringify(this.project));

                request({
                    url:`${api.getLowTensionTree}?projectIds=${this.projectId}`,
                    method:"get",
                }).then(res=>{
                    if( res && res.data){

                        const tree = res.data.reduce((pre,cur)=>{
                            return [...pre,...cur.couList];
                        },[])
                        project.children= tree;
                        this.tree_data = project;
                    }
                })
            },
        },
    }
</script>

<style lang="scss">
    .pjOverdiv{
        height: 100%;
        .wrap{
            height: 100%;
            border-radius: 10px;
            position: relative;
            .map_all{
                height: 100%;
            }
            .alarm_info{
                z-index: 1000;
                position: absolute;
                background: black;
                opacity: 0.8;
                top: 20px;
                right: 10px;
                color: #fff;
                border-radius: 10px;
                padding: 10px 20px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                .title{
                    padding: 5px 0;
                    font-weight: 600;
                    text-align: center;
                    font-size: 20px;
                    // color: var(--themeColor);
                }
                .value{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .info{
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px 0;
                        &_top{
                            display: flex;
                            align-items: center;
                            font-weight: 600;
                            .point{
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                            }
                            .name{
                                margin: 0px 20px;
                                font-size: 16px;
                            }
                            .num{
                                font-size: 18px;
                            }
                        }
                        
                    }
                    
                }
            }
            .relation_btn{
                position: absolute;
                bottom: 20px;
                right: 10px;
                button{
                    border-radius:10rpx;
                }
            }
        }
        // @media screen and (max-width: 870px){
        //     .el-row{
        //         flex-direction: column;
        //         .chartBox{
        //             height: 800px;
        //             margin-bottom: 10px;
        //         } 
        //         .mapBox{
        //             .box-card{
        //                 height: 500px !important;
        //             }
        //         }
        //     }
        // }
    }
    .red{
        color: red;
    }
</style>