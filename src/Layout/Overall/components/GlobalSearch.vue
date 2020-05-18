<template>
    <div class="Global_contanier">
        <el-dialog
            :visible.sync="visible"
            :show-close="false"
            :before-close="closeDialog"
            :modal-append-to-body="false"
        >
            <span slot="title">
                <svg-icon 
                    @click="closeDialog"
                    iconClass="close" 
                    className="close"
                />
            </span>
            <div class="body">
                <div class="body_search">
                    <el-input 
                        v-model="input" 
                        placeholder="支持设备名称,设备编号,eui,安装地址,搜索 "
                        @keyup.enter.native="onInput"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="onInput"></el-button>
                    </el-input>
                </div>
                <div class="body_content">
                    <div class="content_title">
                        <span>搜索结果</span>
                    </div>
                    <el-table
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        :data="data"
                        height="calc(100vh - 260px)"
                        max-height="calc(100vh - 260px)"
                        border
                        stripe
                        size="small"
                    >   
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="table-expand">
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="所属台区">
                                                <span>{{ props.row.courtsName || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="所属配电房">
                                                <span>{{ props.row.roomName || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="所属配电柜">
                                                <span>{{ props.row.chestName || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="所属井盖">
                                                <span>{{ props.row.trapName || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="所属线缆">
                                                <span>{{ props.row.lineName || '---' }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="所属魔节">
                                                <span>{{ (props.row.parentType == 30 && props.row.parentName) || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="所属集中器">
                                                <span>{{ (props.row.parentType == 33 && props.row.parentName) || '---' }}</span>
                                            </el-form-item>
                                            <el-form-item label="创建时间">
                                                <span>{{ calFromNow(props.row.createTime) }}</span>
                                            </el-form-item>
                                            <el-form-item label="安装位置">
                                                <span>{{ props.row.location || '---' }}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="projectName"
                            label="所属项目"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            prop="name"
                            label="设备名称"
                            header-align="center"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="skipDetail(scope.row)"
                                    type="text"
                                >
                                    {{scope.row.name}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="资产编号"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            prop="deviceEui"
                            label="设备EUI"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            prop="deviceAdress"
                            label="设备地址域"
                            header-align="center"
                            align="center"
                        />
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    
    export default {
        name: 'GlobalSearch',
        data() {
            return {
                input:'',
                data: [],
                loading:false,
                timer:null
            }
        },
        props: {
            visible: {
                type: Boolean
            },
            close:{
                type:Function
            }
        },
        methods: {
            ...mapActions('overall',[
                'getAllDevice', 
            ]),
            //时间转换
            calFromNow(time){
                return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
            },
            //关闭弹窗回调
            closeDialog(){
                this.input = "";
                this.data = [];
                this.$props.close()
            },
            //跳转设备详情
            skipDetail(row) {
                const {projectId,projectName,id} = row;
                sessionStorage.setItem('project',JSON.stringify({ id:projectId, name:projectName }));
                sessionStorage.setItem('equipObj',JSON.stringify(row))
                this.$router.push({name:'EquDetail',params:{equipId:id}})
                this.closeDialog();
            },
            //输入框事件,防抖
            onInput(){
                if(!this.input){
                    this.data = [];
                    return 
                }
                this.loading = true;
                clearTimeout(this.timer)
                this.timer =setTimeout(()=>{
                    this.getAllDevice(this.input).then(res=>{
                        this.loading = false;
                        if(!res)return;
                        this.data = res;
                    })
                },1000)
                
            }
        },
    }
</script>

<style lang="scss">
    .Global_contanier{
        .el-dialog{
            margin: 10px !important;
            width: calc(100vw - 20px);
            height: calc(100vh - 20px);
            background: rgba(248, 251, 255,0.95);
            box-shadow: 0 0 8px rgba(108,122,137,.9);
            .el-dialog__header{
                position: relative;
                padding: 40px;
                .close{
                    cursor: pointer;
                    position: absolute;
                    width: 0.9em;
                    height: 0.9em;
                    right: 25px;
                    top:25px;
                }
            }
            .el-dialog__body{
                .body{
                    .body_search{
                        text-align: center;
                        .el-input{
                            max-width: 400px;
                        }
                    }
                    .body_content{
                        .content_title{
                            font-size: 1.3rem;
                            font-weight: 100;
                            color: #6c7a89;
                            text-align: center;
                            margin: 20px 0 0px 0;
                            padding: 5px 0;
                            border-bottom: 1px solid #dadfe1;
                        }
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
                            width: 50%;
                        }
                    }
                }
            }
        }

    }
</style>