<template>
    <div class="Apply-Management"> 
        <el-card class="box-card">
                <div slot="header" class="clearfix" >
                    <slot name="header" >
                        <div>
                            <slot name="select" />
                            <el-input
                                size="small"
                                :placeholder="placeholder"
                                v-model="input"
                                @blur="search"
                            >
                                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                            </el-input>
                        </div>
                        <div v-if="hasAdd">
                            <el-button size="small" type="success" @click="linkTo('add')">
                                添加{{title}}<i class="el-icon-plus el-icon--right" />
                            </el-button>
                        </div>
                    </slot>
                </div>
                <div class="body">
                    <el-table
                        :data="data"
                        border
                        stripe
                        height="68vh"
                        max-height="68vh"
                        header-cell-class-name="table_header"
                    >   
                        <slot></slot>
                        <slot name="operation">
                            <el-table-column
                                label="操作"
                                align="center"
                                width="220"
                                v-if="hasOpera"
                            >
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="primary"
                                            v-if="hasCheck"
                                            @click="linkTo('check',scope.row)"
                                        >
                                            查看
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
        <el-dialog title="提示" :visible.sync="dialogFormVisible" @close="close">
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="passForm">
                <el-form-item label="操作密码" prop="pass">
                    <el-input v-model="form.pass" autocomplete="off" type="password" :maxlength="6"></el-input>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            data:Array,
            total:Number,
            title:String,
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
            verify:{
                type:Boolean,
                default:true
            }
        },
        data() {
            const checkOperaPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入操作密码'));
                }
                this.$store.dispatch('user/checkOperatePass',{
                    id:this.userId,
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
                input:'',
                layout:'total, sizes,pager,jumper',
                current:1,
                size:20,
                dialogFormVisible: false,
                row:{},
                form:{
                    pass:''
                },
                rules:{
                    pass: [{ required: true, validator: checkOperaPass, trigger: 'blur' }],
                }
            }
        },
        mounted () {
            const value = this.$store.state.app.device;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.app.device'(value) {
                this.resizehandle(value);
            },
        },
        computed: {
            placeholder() {
                return `搜索${this.$props.title}` 
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('userDetail')).id; 
            }
        },
        methods: {
            resizehandle(value){
                value==='desktop'?this.layout='total,sizes,pager,jumper' :this.layout = 'pager'
            },
            //搜索
            search(){
                this.current = 1;
                const val = this.input.replace(/ /g,'');
                this.getList({
                    filterStr:val,
                    current:1
                })
            },
            //切换显示个数
            handleSizeChange(val) {
                this.size = val;
                this.current =1;
                this.getList({
                    size:val
                })
            },
            //切页
            handleCurrentChange(val) {
                this.current = val;
                this.getList({
                    current:val
                })
            },
            //应用跳转
            linkTo(type,row={}){
                switch (type) {
                    case 'check':
                        this.skipTo(type,row);
                        break;
                    case 'add':
                    case 'edit':
                        this.skipTo(type,row);
                        break;
                    case 'delete' :
                        this.open(row);
                        break;
                    default:
                        break;
                }
            },
            open(row) {
                if(this.verify){
                    this.dialogFormVisible = true;
                    this.row = row;
                }else{
                    this.$confirm(`此操作将永久删除该${this.title}, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.remove(row);
                    }).catch(() => {});
                }
            },
            //关闭弹窗
            close(){
                this.dialogFormVisible = false;
                this.$refs.passForm.resetFields();
            },
            //提交表单
            submit(){
                this.$refs.passForm.validate((valid) => {
                    if (valid) {
                        this.remove(this.row);
                        this.close();
                    } else {
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
            width: 350px;
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
                .submit{
                    padding-top: 10px;
                    text-align: center;
                }
            }
        }
    }
</style>