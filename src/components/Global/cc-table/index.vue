<template>
    <div class="Apply-Management"> 
        <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <slot name="header" >
                        <div>
                            <slot name="select" />
                            <div>
                                <el-input
                                    size="small"
                                    :placeholder="placeholder"
                                    v-model="input"
                                    @keyup.enter.native="search"
                                >   
                                    <!-- @blur="search" -->
                                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                </el-input>
                            </div>
                        </div>
                        <div v-if="hasAdd">
                            <el-button type="info" size="small" v-if="hasUpload" @click="linkTo('otherFuc')">
                                其他功能
                                <i class="el-icon-circle-plus-outline el-icon--right"/>
                            </el-button>
                            <el-button type="primary" size="small" v-if="hasUpload" @click="linkTo('upload')">
                                批量上传
                                <i class="el-icon-upload el-icon--right"/>
                            </el-button>
                            <el-button size="small" type="success" @click="linkTo('add')" >
                                添加{{title}}<i class="el-icon-plus el-icon--right" />
                            </el-button>
                        </div>
                    </slot>
                </div>
                <div class="body">
                    <el-table
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        :data="data"
                        border
                        stripe
                        :height="table_height"
                        :max-height="table_height"
                        header-cell-class-name="table_header"
                        ref="tabledns"
                        fit
                    >   
                        <slot></slot>
                        <slot name="operation">
                            <el-table-column
                                label="操作"
                                align="center"
                                :width="isDevice?350:300"
                                v-if="hasOpera"
                            >
                                    <template slot-scope="scope">
                                        <slot name="btnGroup"></slot>
                                        <!-- <el-button
                                            size="mini"
                                            type="primary"
                                            v-if="hasCheck"
                                            @click="linkTo('check',scope.row)"
                                        >
                                            {{title==='角色'||title==='用户'?'权限分配':'查看'}}
                                        </el-button> -->
                                        <el-button
                                            size="mini"
                                            type="primary"
                                            v-if="isDevice && inThresholdRange(scope.row.deviceType)"
                                            @click="linkTo('set',scope.row)"
                                        >
                                            阈值设置
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="success"
                                            @click="linkTo('edit',scope.row)"
                                        >
                                            编辑
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="linkTo('delete',scope.row)"
                                        >
                                            删除
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="warning"
                                            v-if="isDevice && scope.row.remark1==1"
                                            @click="linkTo('active',scope.row)"
                                        >
                                            激活
                                        </el-button>
                                    </template>
                            </el-table-column>
                        </slot>
                        
                    </el-table>
                </div>
                <div class="footer">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="current"
                        :page-sizes="[20, 30, 50]"
                        :page-size="size"
                        :layout="layout"
                        :total="total"
                    >
                    </el-pagination>
                </div>
        </el-card>
        <!-- 用于资产删除验证操作密码 -->
        <el-dialog title="提示" :visible.sync="dialogFormVisible" @close="close" :close-on-click-modal="false">
            <div class="wrap_step" v-if="hasStep">
                <div class="step">
                    <el-steps :active="active" finish-status="success">
                        <el-step></el-step>
                        <el-step></el-step>
                    </el-steps>
                </div>
            </div>
            <div v-if="!active&&hasStep">
                <div class="msgBox">
                    该资产下有设备<span class="box">{{count.deviceCount}}</span>台
                        <span v-if="count.lineCount"> , 线缆<span class="box">{{count.lineCount}}</span>条</span>
                        , 是否继续删除 ?
                </div>
                <div class="submit" style="margin-bottom:22px">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="active++">下一步</el-button>
                </div>
            </div>
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="passForm" status-icon v-else>
                <el-form-item label="操作密码" prop="pass" class="pass">
                    <el-input 
                        v-model="form.pass" 
                        autocomplete="off" 
                        type="password" 
                        :maxlength="6"
                    />
                </el-form-item>
                <el-form-item class="submit">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="deviceDialogVisible" @close="close" :close-on-click-modal="false">
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="passForm" status-icon >
                <el-form-item label="操作密码" prop="pass" class="pass">
                    <el-input 
                        v-model="form.pass" 
                        autocomplete="off" 
                        type="password" 
                        :maxlength="6"
                    />
                </el-form-item>
                <el-form-item class="submit">
                    <el-button @click="deviceDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit('device')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import { judgeLastData, isMobile } from '@/utils/methods'
    import _ from 'lodash'

    export default {
        name:'cc-table',
        props: {
            title:String,
            assetType:Number,
            getList:Function,
            skipTo:{
                type:Function,
                default:()=>{}
            },
            remove:{
                type:Function,
                default:()=>{}
            },
            hasCheck:{
                type:Boolean,
                default:false
            },
            hasOpera:{
                type:Boolean,
                default:true
            },
            hasAdd:{
                type:Boolean,
                default:true
            },
            isDevice:{
                type:Boolean,
                default:false
            },
            verify:{
                type:Boolean,
                default:false
            },
            hasUpload:{
                type:Boolean,
                default:false
            }
        },
        data() {
            const checkOperaPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入操作密码'));
                }
                this.$store.dispatch('user/checkOperatePass',{
                    id:this.userDetail.id,
                    operationPwd:value
                }).then(res=>{
                    if(!res){
                        return callback(new Error('操作密码错误'));
                    }else{
                        callback()
                    }
                })
            };
            return {
                table_height:"calc(100vh - 300px)",
                input:'',
                layout:'total, sizes,pager,jumper',
                data:[],
                total:0,
                current:1,
                size:20,
                dialogFormVisible: false,
                deviceDialogVisible:false,
                active: 0,
                count:{
                    deviceCount:0,
                    lineCount:0
                },
                hasStep:true,
                row:{},
                form:{
                    pass:''
                },
                rules:{
                    pass: [{ required: true, validator: checkOperaPass, trigger: 'blur' }],
                },
                loading:true,
                pageParams:{
                    current:1,
                    size:20
                }
            }
        },
        mounted() {
            this.initPageParams();

            this.getListData();
        },
        computed: {
            ...mapState('user',[
                'userDetail'
            ]),
            placeholder() {
                return `搜索${this.$props.title}` 
            }
        },
        methods: {
            ...mapActions('asset',[
                'getEquipCount', 
                'getCountUnderTrap',
                'getCountUnderMainLine'
            ]),
            /**
             * @description 2020/11/10 生成pageParams 初始化"页码/每页显示条数"信息
             */
            initPageParams(){
                const project = JSON.parse(sessionStorage.getItem('project')) || null;
                const session_pageParams = JSON.parse(sessionStorage.getItem("pageParams")) || null;

                const params = { module:this.$route.name, data: this.pageParams };
                project && (params.projectId = project.id);

                if( !session_pageParams ){
                    sessionStorage.setItem("pageParams",JSON.stringify(params));
                    return;
                }

                if( (this.$route.name !== session_pageParams.module) || ( project && (project.id !== session_pageParams.projectId))){
                    sessionStorage.setItem("pageParams",JSON.stringify(params));
                }
            },
            //获取数据
            async getListData(params={}){
                this.loading = true;
                const { data } = JSON.parse(sessionStorage.getItem("pageParams"));
                let pageParams = {
                    ...data, 
                    ...params, 
                    current:params.pageNum ||params.current || data.current,
                    size:params.pageSize || params.size || data.size
                };

                // let pageParams = {};
                
                //获取列表数据
                const LIST = await this.getList(pageParams);
                if( LIST ){
                    const { data, page, dataList, total, list } = LIST;

                    //手机端将表格高度&最高高度设置为1060(有调整的空间)
                    await isMobile() && (this.table_height = window.innerHeight);

                    this.data = dataList || data || list;
                    this.total = page? page.total : total;

                    this.current = pageParams.current;
                    this.size = pageParams.size;
                }
                this.loading = false;
            },
            //搜索
            search:_.throttle(function(){
                this.current = 1;
                const val = this.input.replace(/ /g,'');
                this.getListData({
                    filterStr:val || null,
                    nameOrAssetsCode:val || "",
                    keyWordName:val || "",
                    current:1
                });
            },500),
            //切换显示个数
            handleSizeChange(val) {
                this.setPageParam("size",val);

                this.size = val;
                this.current =1;
                this.getListData({ size:val, current:1, pageNum:1, pageSize:val });
                this.$nextTick(()=>{this.$refs.tabledns.bodyWrapper.scrollTop = 0 });
            },
            //切页
            handleCurrentChange(val) {
                this.setPageParam("current",val);

                this.current = val;
                this.getListData({ current:val, pageNum: val });
                this.$nextTick(()=>{this.$refs.tabledns.bodyWrapper.scrollTop = 0 });
            },
            //保存之前页码与每页展示条数
            setPageParam(type,val){
                const params = JSON.parse(sessionStorage.getItem("pageParams"));

                this.pageParams = {
                    ...this.params, 
                    ...params.data
                };

                this.pageParams[type] = val;
                type === "size" && (this.pageParams.current = 1);

                sessionStorage.setItem("pageParams",JSON.stringify({ 
                    ...params, 
                    data:this.pageParams
                }));
            },
            //应用跳转
            linkTo(type,row={}){
                switch (type) {
                    case 'check':
                    case 'add':
                    case 'edit':
                    case 'set':
                    case 'active':
                    case 'upload':
                    case 'otherFuc':
                        this.skipTo(type,row);
                        break;
                    case 'delete' :
                        this.open(row);
                        break;
                    default:
                        break;
                }
            },
            async open(row) {
                if(this.verify){
                    this.row = row;
                    let result;
                    //4为井盖,6为主线缆
                    if(this.assetType===4 || this.assetType===6){
                        this.assetType ===4?
                            result = await this.getCountUnderTrap(row.id).then(res=>res) :
                            result= await this.getCountUnderMainLine(row.id).then(res=>res);
                        if(!result)return;
                        const {deviceCount,lineCount} = result;
                        if(deviceCount||lineCount){ this.count = result };
                        this.hasStep = deviceCount||lineCount
                    }else{
                        await this.getCountUnderAsset(row.id)
                    }
                    this.dialogFormVisible = true;
                }else{
                    this.row = row;
                    this.deviceDialogVisible = true;
                    // this.$confirm(`此操作将永久删除该${this.title}, 是否继续?`, '提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                    //     const curPage = judgeLastData( this.data, this.current );
                    //     this.remove( row, curPage );
                    // }).catch(() => {});
                }
            },
            //判断设备是否属于可设置阈值范围内
            inThresholdRange:(type)=>{
                //线缆,红外,烟雾,侵水(液位),魔节,S800
                // const range = [38,32,35,37,30,28,36];
                const range = [ 33 ];
                return range.includes(+type);
            },
            //获取资产下设备数量
            getCountUnderAsset(id){
                this.getEquipCount({
                    queryId:id,
                    queryType:this.assetType
                }).then(res=>{
                    if(res===false)return;
                    this.count = {deviceCount:res};
                    this.hasStep = res;
                })
            },
            //关闭弹窗
            close(){
                this.dialogFormVisible = false;
                this.deviceDialogVisible = false;
                this.active = 0;
                this.$refs.passForm&&this.$refs.passForm.resetFields();
            },
            //提交表单
            submit(){
                this.$refs.passForm.validate((valid) => {
                    if (valid) {
                        const curPage = judgeLastData( this.data, this.current );
                        this.remove({
                            ...this.row,
                            operationPwd:this.form.pass
                        }, curPage);
                        this.close();
                    } else {
                        this.$message({
                            message: '请正确填写表单信息!',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .Apply-Management{
            .clearfix{
                flex-direction: column;
                align-items: normal !important;
                div{
                    &:last-child{
                        padding-top: 10px;
                    }
                }
            }
            .footer{
                justify-content: center !important;
            }
        }
    }
    .Apply-Management{
        .box-card{
            .el-card__header{
                padding: 15px 20px;
                .clearfix{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    div{
                        display: flex;
                        align-items: center;
                        .el-input__inner{
                            max-width: 200px;
                            height: 40px;
                        }
                        .el-input-group__append{
                            width: 50px;
                            padding: 0;
                            height: 38px;
                            display: flex;
                            justify-content: center;
                            .el-button{
                                padding: 0;
                            }
                        }
                    }
                }
            }
            .el-card__body{
                padding: 20px 20px 0px;
                .table-expand label {
                    min-width: 120px;
                    color: #34495e;
                    font-weight: bold;
                }
                .table-expand {
                    font-size: 0;
                }
                .table-expand .el-form-item {
                    margin-bottom: 0;
                    width: 100%;
                }
                .footer{
                    padding: 15px 0;
                    display: flex;
                    justify-content: flex-end;
                    .el-pagination{
                        display: flex;
                        align-items: center; 
                    }
                }
            }
        }
        .el-dialog{
            width: 400px;
            max-width: 100%;
            border-radius: 10px;
            .el-dialog__header{
                padding: 10px 20px;
                display: flex;
                align-items: center;
                .el-dialog__headerbtn{
                    top: 15px;
                }
            }
            .el-dialog__body{
                padding: 4px 20px;
                .wrap_step{
                    display: flex;
                    justify-content: center;
                    .step{
                        width: 60%;
                    }
                }
                .msgBox{
                    height: 80px;
                    line-height: 80px;
                    text-align: center;
                    font-size: 0.8rem;
                    padding-top:15px;
                    margin-bottom: 15px;
                    .box{
                        color: #f00303;
                        font-weight: bold;
                        font-size: 0.9rem;
                        padding: 0 5px;
                    }
                }
                .pass{
                    padding-top:15px;
                    margin-bottom: 15px;
                }
                .submit{
                    padding-top: 10px;
                    text-align: center;
                }
            }
        }
    }
</style>