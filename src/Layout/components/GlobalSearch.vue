<template>
    <div class="Global_contanier">
        <el-dialog
            :visible.sync="visible"
            :show-close="false"
            :before-close="closeDialog"
            :modal-append-to-body="false"
        >
            <span slot="title">
                <svg class="close" aria-hidden="true" @click="closeDialog" @mouseover="hover=true" @mouseleave="hover=false">
                    <use :xlink:href="hover?'#icon-icon_close_hover':'#icon-icon_close'"></use>
                </svg>
            </span>
            <div class="body">
                <div class="body_search">
                    <el-input 
                        v-model="input" 
                        placeholder="请输入设备名称或设备ID"
                        suffix-icon="el-icon-search"
                        @input="onInput"
                    />
                </div>
                <div class="body_content">
                    <div class="content_title">
                        <span>搜索结果</span>
                    </div>
                    <div 
                        class="content_result" 
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                    >
                        <el-table
                            v-if="data.length"
                            :data="data"
                            ref="filterTable"
                            max-height='calc(100vh - 270px)'
                        >   
                            <el-table-column
                                prop="id"
                                label="ID"
                                width="180"
                                header-align="center"
                                align="center"
                            />
                            <el-table-column
                                prop="equipType"
                                label="设备类型"
                                width="180"
                                header-align="center"
                                align="center"
                                :filters="Types"
                                :filter-method="filterType"
                                filter-placement="bottom-end"
                            />
                            <el-table-column
                                label="设备名称"
                                header-align="center"
                                align="center"
                                
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="skipDetail(scope.row)"
                                        type="text"
                                        size="small"
                                    >
                                        {{scope.row.equipName}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="设备EUI"
                                header-align="center"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.dev_eui }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="location"
                                label="位置信息"
                                header-align="center"
                                align="center"
                            />
                            <el-table-column 
                                label="操作"
                                header-align="center"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <!-- <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)"
                                    >
                                        查看
                                    </el-button> -->
                                    <el-button
                                        size="mini"
                                        type="success"
                                        @click="handleDelete(scope.$index, scope.row)"
                                    >
                                        编辑
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'GlobalSearch',
        data() {
            return {
                hover:false,
                input:'',
                Types:[
                    { text: '魔节', value: '魔节' }, 
                    { text: '线缆温度传感器', value: '线缆温度传感器' }
                ],
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
            //关闭弹窗回调
            closeDialog(){
                this.input = "";
                this.data = [];
                this.$refs.filterTable&&this.$refs.filterTable.clearFilter();
                this.$props.close()
            },
            //跳转设备详情
            skipDetail(res) {
                console.log(res,'rows')
            },
            //筛选设备类型
            filterType(value, row) {
                return row.equipType === value;
            },
            //输入框事件,防抖
            onInput(value){
                // this.loading = true;
                clearTimeout(this.timer)
                this.timer =setTimeout(()=>{
                    this.data=[
                        {
                            id:12,
                            equipType:'魔节',
                            equipName:'中科能源',
                            dev_eui:1234,
                            location:'中科院'
                        }
                    ]
                    // this.loading = false;
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
                        .el-input__inner{
                            height: 45px;
                            border: 1px solid #d2d6d9;
                            border-radius: 20px;
                            font-size: 15px;
                            &:focus{
                                border-color:#82c4f2; 
                            }
                            &::-webkit-input-placeholder {
                                color: #757575;
                                font-size: 15px;
                            }
                        }
                    }
                    .body_content{
                        .content_title{
                            font-size: 30px;
                            font-weight: 100;
                            color: #6c7a89;
                            text-align: center;
                            margin: 20px 0 0px 0;
                            padding: 5px 0;
                            border-bottom: 1px solid #dadfe1;
                        }
                        .content_result{
                            height:calc(100vh - 270px);
                        }
                    }
                }
            }
        }

    }
</style>