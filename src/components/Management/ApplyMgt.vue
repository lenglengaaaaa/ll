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
                                suffix-icon="el-icon-search"
                                v-model="input"
                            />
                        </div>
                        <div>
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
                        height="68.5vh"
                        max-height="68.5vh"
                        header-cell-class-name="table_header"
                    >   
                        <slot></slot>
                        <slot name="operation">
                            <el-table-column
                                label="操作"
                                align="center"
                                width="150"
                            >
                                    <template slot-scope="scope">
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
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        :layout="layout"
                        :total="total"
                    >
                    </el-pagination>
                </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            data:Array,
            total:Number,
            title:String,
            getList:Function,
            skipTo:Function,
            remove:Function
        },
        computed: {
            placeholder() {
                return `搜索${this.$props.title}` 
            }
        },
        data() {
            return {
                input:'',
                layout:'total, sizes,pager,jumper',
                currentPage:1,
                pageSize:10,
                visible:false,
                value:{},
            }
        },
        mounted () {
            const value = this.$store.state.app.device;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.app.device'(value) {
                console.log(value,'value')
                this.resizehandle(value);
            },
            input(value){
                this.getList()
            }
        },
        methods: {
            resizehandle(value){
                value==='desktop'?this.layout='total,sizes,pager,jumper' :this.layout = 'pager'
            },
            handleSizeChange(val) {
                this.currentPage =1;
                this.getList()
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.getList()
                console.log(`当前页: ${val}`);
            },
            //应用跳转
            linkTo(type,row={}){
                switch (type) {
                    case 'check':
                        console.log('cheack')
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
                const type = this.type==='gateway'?'网关':'应用'
                this.$confirm(`此操作将永久删除该${type}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 992px) {
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
    }
</style>