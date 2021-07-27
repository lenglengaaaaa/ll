<template>
    <div>
        <cc-table
            title="告警"
            :getList="getList"
            :hasAdd="false"
        >   
            <template #select>
                <div class="alarmTool">
                    <el-select v-model="rank" placeholder="请选择告警级别" @change="changeRank">
                        <el-option label="设备告警" :value="1" />
                        <el-option label="装置告警" :value="2" />
                    </el-select>
                    <el-select v-model="value" placeholder="请选择" @change="changeStaus">
                        <el-option
                            v-for="item in status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-date-picker
                        v-model="time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable='false'
                        @change="changeTime"
                    />
                </div>
            </template>
            <template>
                <el-table-column 
                    align="center"
                    label="查看" 
                    width="80"
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click="toogleExpand(scope.row)">明细</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand" width="1" className="alarmExpand">
                    <template>
                        <div class="detail_info">
                            <el-table
                                :data="detail_info.data"
                                max-height="300"
                                v-loading="loading"
                                element-loading-text="拼命加载中"
                                element-loading-spinner="el-icon-loading"
                            >
                                <el-table-column label="告警详情" align="center">
                                    <template slot-scope="scope" >
                                        <span class="red">
                                            {{ scope.row.prompt }}{{ scope.row.prompt.length?'相':'' }}{{scope.row.typeName}}{{ noHasDecodeHex(scope.row.typeCode)?'' : scope.row.decodeHex }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="告警时间" align="center">
                                    <template slot-scope="scope" >
                                        {{ scope.row.createTime }}
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="操作" align="center" width="150">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="success"
                                            @click="linkTo(scope.row)"
                                        >
                                            查看
                                        </el-button>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size="50"
                                :total="detail_info.total"
                                :hide-on-single-page="true"
                                @current-change="detailInfo_currentChange"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="parentName"
                    label="告警设备"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    label="告警内容"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <span class="red">
                            {{ scope.row.prompt }}{{ scope.row.prompt.length?'相':'' }}{{scope.row.typeName}}{{ noHasDecodeHex(scope.row.typeCode)?'' : scope.row.decodeHex }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="告警次数"
                    align="center"
                >
                    <template slot-scope="scope" >
                        <span class="red">
                            {{scope.row.count}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="createTime"
                    label="告警时段"
                    align="center"
                    min-width="110"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        {{$moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss')}} -
                        {{$moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column> -->
            </template>
            <template #operation>
                <div></div>
                <!-- <el-table-column
                    label="操作"
                    align="center"
                    width="150"
                >
                    <template slot-scope="scope" >
                        <el-button 
                            size="mini"
                            type="primary"
                            @click="openDialog(scope.row)"
                        > 
                            处理 
                        </el-button>
                    </template>
                </el-table-column> -->
            </template>
        </cc-table>
        <el-dialog
            title="告警处理"
            width="330px"
            :visible.sync="dialogVisible"
            center
            @close="closeDialog"
            class="dispose_dialog"
        >
            <el-form 
                label-width="320px" 
                :model="disposeForm" 
                ref="disposeForm" 
                label-position="top"
                class="disposeForm"
            >  
                <el-form-item label="设备名称 : ">
                    <span style="fontWeight:bold">
                        {{dialog_row? dialog_row.name: ""}}
                    </span>
                </el-form-item>
                <template v-if="dialog_row && dialog_row.details">
                    <el-form-item label="处理方式 : ">
                        <span style="fontWeight:bold">
                            {{ 
                                dialog_row.status ==1?
                                "已处理":dialog_row.status ==2?"不予处理"
                                    :"延期处理"
                            }}
                        </span>
                    </el-form-item>
                    <el-form-item label="处理详情 : ">
                        <span style="fontWeight:bold">
                            {{dialog_row.details}}
                        </span>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="处理方式 : ">
                        <div class="disposeForm-result">
                            <span 
                                v-for="item in disposeOptions" 
                                :key="item.value"
                                :style="{
                                    color:disposeForm.result == item.value?'#22a7f0':'',
                                }"
                                @click="disposeForm.result = item.value"
                            >
                                {{item.label}}
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="处理详情 : ">
                        <el-input type="textarea" v-model="disposeForm.desc" placeholder="请填写处理详情"></el-input>
                    </el-form-item>
                    <el-form-item class="disposeForm-btn">
                        <el-button type="primary"  @click="submitForm" >
                            提交
                        </el-button>
                    </el-form-item>
                </template>
            </el-form>
                
        </el-dialog>
    </div>
    
</template>

<script>
    import { mapActions } from 'vuex'
    import { request } from '@/utils/Request'
    import { api } from '@/utils/API'
    import { tip } from '@/utils/methods'

    
    export default {
        data() {
            return {
                time:[
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment().format('YYYY-MM-DD 23:59:59')
                ],
                value: 0,
                status:[
                    {value:0,label:'未处理'},
                    {value:1,label:'已处理'},
                ],
                loading: false,
                rank:1,
                params:{
                    rank:1,
                    projectId:JSON.parse(sessionStorage.getItem('project')).id,
                    size:20,    
                    current:1,   
                    status:0,
                    keyWordName:""
                },
                row:null,
                dialog_row:null,
                detail_info:{
                    data:[],
                    total:0
                },
                disposeOptions:[
                    { value:1, label:'已处理' },
                    { value:2, label:'不予处理' },
                    { value:3, label:'延期处理' },
                ],
                dialogVisible: false,
                disposeForm:{
                    result: 1,
                    desc: ""
                }
            }
        },
        mounted () {
            const { status, startTime, endTime, rank } = this.pageParams.data;

            rank != null  && ( this.rank = rank ); 
            status != null  && ( this.value = status ); 
            startTime && (this.time = [ startTime, endTime ]);
        },
        computed: {
            projectId() {
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
            pageParams(){
                return JSON.parse(sessionStorage.getItem("pageParams"));
            }
        },
        methods: {
            ...mapActions('overall',[
                'getAlarmList',
                "getRankAlarmDetail",
                "handleAlarm",
                'exportAlarm' 
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getWarnList(data).then(res=>{
                    if(!res)return;
                    return res;
                })
            },
            // 展开状态切换
            toogleExpand(row) {

                let $table = this.$children[0].$refs.tabledns;
                let data = this.$children[0].data;
                data && data.map((item) => {
                    if (row.id != item.id) {
                        $table.toggleRowExpansion(item, false)
                    }
                })

                setTimeout(() => {
                    $table.toggleRowExpansion(row);
                    if( !this.row || (row.id != this.row.id)){ 
                        this.row = row;
                        this.getWarnDetailList({
                            deviceAddress: row.deviceAdress,
                            status: row.status,
                            projectIds: row.projectId,
                            warnGrade: row.warnGrade,
                            page:1,
                            count: 50,
                            warnType:row.typeCode,
                        });
                    };    
                }, 100);
            },
            linkTo(row) {
                sessionStorage.setItem('obj',JSON.stringify({ ...row, cmdType: this.rank}));
                this.$router.push({name:'AlarmDetail',params:{ warnInfoId:row.id }})
            },
            //处理回调
            submitForm() {
                this.$refs.disposeForm.validate((valid) => {
                    if (valid) {
                        const { result, desc } = this.disposeForm;
                        const { id } = this.dialog_row;
                        this.handleAlarm({
                            status: result,
                            details: desc,
                            warningId: id
                        }).then(res=>{
                            if(!res)return;
                            this.$children && this.$children[0] && this.$children[0].getListData(this.params);
                            this.closeDialog();
                        })
                    } 
                });
            },
            // 明细分页切换
            detailInfo_currentChange(cur){
                this.getWarnDetailList({
                    deviceAddress: this.row.deviceAdress,
                    status: this.row.status,
                    projectIds: this.row.projectId,
                    warnGrade: this.row.warnGrade,
                    page:cur,
                    count: 50,
                    warnType:this.row.typeCode,
                });
            },
            // 打开对话框
            openDialog(row){
                this.dialogVisible = true;
                this.dialog_row = row;
            },
            // 隐藏对话框
            closeDialog(){
                this.dialogVisible = false;
                this.disposeForm = {
                    result: 1,
                    desc: ""
                }
            },
            //切换告警等级
            changeRank(val){
                const data = {
                    ...this.params,
                    rank:val,
                    current:1
                }
                sessionStorage.setItem("pageParams",JSON.stringify({...this.pageParams, data}));

                this.params = data;
                this.$children[0]&&this.$children[0].getListData(data);
            },
            //切换状态回调
            changeStaus(val){
                const data ={
                    ...this.params,
                    status:val,
                    current:1
                }

                sessionStorage.setItem("pageParams",JSON.stringify({...this.pageParams, data}));

                this.params = data;
                this.$children[0]&&this.$children[0].getListData(data);
            },
            //切换时间回调
            changeTime(time){
                const [ startTime, endTime ] = time;
                this.time = [ 
                    this.$moment(startTime).format('YYYY-MM-DD 00:00:00'),  
                    this.$moment(endTime).format('YYYY-MM-DD 23:59:59')
                ];

                const data ={
                    ...this.params,
                    current:1
                }
                this.params = data;

                sessionStorage.setItem("pageParams",JSON.stringify({...this.pageParams, data}));
                this.$children && this.$children[0] && this.$children[0].getListData(data)
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
             * 告警列表查询
             */
            getWarnList(data){
                const [ startTime, endTime ] = this.time;
                const { rank, status, current, size, keyWordName, projectId } = data;

                return request({
                    url:`${api.getWarnListByGroup}?projectId=${projectId}&warnGrade=${rank}&startTime=${startTime}&endTime=${endTime}&keyWordName=${keyWordName}&page=${current}&count=${size}&status=${status}`,
                    method:"get"
                }).then(res=>{
                    if( res && res.data ){
                        return res.data;
                    }else{
                        tip("告警列表获取失败");
                        return false;
                    }   
                })
            },
            /**
             * 获取明细列表
             */
            getWarnDetailList(data){
                this.loading = true;
                const [ startTime, endTime ] = this.time;
                request({
                    url:`${api.getWarnSift}`,
                    method:"post",
                    data:{
                        ...data,
                        startTime,
                        endTime
                    }
                }).then(res=>{
                    if( res && res.data ){
                        const { list, total } = res.data;
                        this.detail_info = {
                            data: list,
                            total
                        }
                    }else{
                        tip("告警明细获取失败");
                    }   
                })
                .finally(res=>{
                    this.loading = false;

                    // 需调用,否则数据无法及时更新
                    let $table = this.$children[0].$refs.tabledns;
                    $table.toggleRowExpansion()
                })
            }
        },
    }
</script>

<style lang="scss">
    .red{
        color: red;
    }
    .alarmTool{
        .el-select{
            padding-right: 20px;
            .el-input__inner{
                max-width: 150px !important;
            }
        }
        .el-date-editor{
            margin-right: 20px;
        }
        .el-input__inner{
            max-width: 300px !important;
        }
        .el-icon-download{
            padding: 8px;
            cursor: pointer;
            background: #ecefef;
            border-radius: 5px;
            margin-right: 20px;
        }
    }

    .alarmExpand{
        .el-icon-arrow-right{
            display: none !important;
        }
    }

    .detail_info{
        .el-pagination{
            padding-top: 20px;
            display: flex;
            justify-content: center;
            .el-pager li{
                border: none;
            }
        }
    }

    .dispose_dialog{
        .el-dialog__header{
            padding-top: 15px;
            border-radius: 10px 10px 0px 0px;
            background-color: #eee;
            color: #000;
            font-weight: bold;
        }   
        .el-dialog__body{
            .disposeForm{
                .el-form-item{
                    margin-bottom: 10px !important;
                }
                &-result{
                    display: flex;
                    justify-content: space-between;
                    span{
                        cursor: pointer;
                    }
                }
                &-btn{
                    text-align: center;
                    margin: 0px !important;
                    padding-bottom: 5px;
                }
            }
        }
        
    }
    
    
</style>