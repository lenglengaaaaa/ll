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
                        <el-option label="一级告警" :value="83" />
                        <el-option label="二级告警" :value="82" />
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
                    <i class="el-icon-download" @click="download" title="导出告警"/>
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
                                            {{scope.row.decodeHex}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="告警时间" align="center">
                                    <template slot-scope="scope" >
                                        {{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="150">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="success"
                                            @click="linkTo(scope.row)"
                                        >
                                            查看
                                        </el-button>
                                    </template>
                                </el-table-column>
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
                    label="设备名称"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.name||'---'"
                />
                <el-table-column
                    label="设备EUI"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.deviceEUI||'---'"
                />
                <el-table-column
                    label="设备地址域"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.deviceAddress||'---'"
                />
                <el-table-column
                    label="告警详情"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope" >
                        <span class="red">
                            {{scope.row.info}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="告警次数"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope" >
                        <span class="red">
                            {{scope.row.number}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="处理状态"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope" >
                        <el-tag :type="!scope.row.status?'danger':'success'">
                            {{diffStatus(scope.row.status)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
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
                </el-table-column>
            </template>
            <template #operation>
                <el-table-column
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
                </el-table-column>
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
                
                <el-form-item label="处理结果 : ">
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
            </el-form>
                
        </el-dialog>
    </div>
    
</template>

<script>
    import { mapActions } from 'vuex'
    import { downFile } from '@/utils/methods'
    
    export default {
        data() {
            return {
                time:[
                    this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), 
                    this.$moment().format('YYYY-MM-DD')
                ],
                value:null,
                status:[
                    {value:null,label:'全部'},
                    {value:0,label:'未处理'},
                    {value:1,label:'已处理'},
                    {value:2,label:'不予处理'},
                    {value:3,label:'延期处理'},
                ],
                loading: false,
                rank:83,
                params:{
                    rank:83,
                    projectId:JSON.parse(sessionStorage.getItem('project')).id,
                    size:20,    
                    current:1,   
                    status:null
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
                return this.getAlarmList(data).then(res=>{
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
                        this.row = row
                        this.getAlarmDetail({
                            ...row,
                            warnId: row.id,
                            size: 50
                        });
                    };    
                }, 100);
            },
            // 获取告警详情
            getAlarmDetail(obj){
                this.loading = true;
                this.getRankAlarmDetail(obj).then(res=>{
                    if(!res) return;

                    const { data, page } = res;
                    this.detail_info={ data, total: page.total };
                }).finally(res=>{
                    this.loading = false;
                })
            },
            linkTo(row) {
                sessionStorage.setItem('obj',JSON.stringify({ ...row, cmdType: this.rank}));
                this.$router.push({name:'AlarmDetail',params:{ warnInfoId:row.id }})
            },
            //处理回调
            submitForm() {
                console.log(this.dialog_row,'dialog_row');
                this.$refs.disposeForm.validate((valid) => {
                    if (valid) {
                        // this.handleAlarm({
                        //     status:val,
                        //     details:value,
                        //     warningId:id,
                        //     type
                        // }).then(res=>{
                        //     if(!res)return;
                            this.$children && this.$children[0] && this.$children[0].getListData(this.params);
                            this.closeDialog();
                        // })
                    } 
                });
            },
            // 明细分页切换
            detailInfo_currentChange(cur){
                this.getAlarmDetail({
                    ...this.row,
                    warnId: this.row.id,
                    size: 50,
                    current:cur
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
                this.time = [ startTime, endTime ];

                const data ={
                    ...this.params,
                    startTime,
                    endTime,
                    current:1
                }
                this.params = data;

                sessionStorage.setItem("pageParams",JSON.stringify({...this.pageParams, data}));
                this.$children && this.$children[0] && this.$children[0].getListData(data)
            },
            diffStatus(status){
                const obj = {
                    0:'未处理',
                    1:'已处理',
                    2:'不予处理',
                    3:'延期处理'
                }
                return obj[status];
            },
            //下载
            download: _.throttle(function(){
                const msg = this.$message({
                    iconClass:"el-icon-loading",
                    dangerouslyUseHTMLString: true,
                    message:`<strong class="loadingMsg">告警数据下载中...</strong>`,
                    duration:0
                });
                const startTime = this.time[0];
                const endTime = this.time[1];
                this.exportAlarm({
                    filterStr: this.$children && this.$children[0] && this.$children[0].input || null,
                    projectId:this.projectId,
                    type:this.value,
                    startTime,
                    endTime
                }).then(res=>{
                    if(!res)return;
                    msg.close();
                    downFile(res);
                })
            },5000),
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