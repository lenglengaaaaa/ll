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
                    >   
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
                        <el-table-column
                            prop="courtsName"
                            label="所属台区"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>row.courtsName || '-'"
                        />
                        <el-table-column
                            prop="roomName"
                            label="所属配电房"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>row.roomName || '-'"
                        />
                        <el-table-column
                            prop="chestName"
                            label="所属配电柜"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>row.chestName || '-'"
                        />
                        <el-table-column
                            prop="trapName"
                            label="所属井盖"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>row.trapName || '-'"
                        />
                        <el-table-column
                            prop="lineName"
                            label="所属线缆"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>row.lineName || '-'"
                        />
                        <el-table-column
                            label="所属魔节"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>( row.parentType==30&&row.parentName )|| '-'"
                        />
                        <el-table-column
                            label="所属集中器"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>( row.parentType==33&&row.parentName )|| '-'"
                        />
                        <!-- <el-table-column 
                            label="操作"
                            header-align="center"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)"
                                >
                                    查看
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="success"
                                    @click="handleDelete(scope.$index, scope.row)"
                                >
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column> -->
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
                        // .el-input__inner{
                        //     height: 45px;
                        //     border: 1px solid #d2d6d9;
                        //     border-radius: 20px;
                        //     font-size: 0.9rem;
                        //     &:focus{
                        //         border-color:#82c4f2; 
                        //     }
                        //     &::-webkit-input-placeholder {
                        //         color: #757575;
                        //         font-size: 0.9rem;
                        //     }
                        // }
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
                    }
                }
            }
        }

    }
</style>