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
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="size"
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
            getList:{
                type:Function,
                default:()=>{}
            },
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
            }
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
                current:1,
                size:10,
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
            input(value){
                // this.getList()
            }
        },
        methods: {
            resizehandle(value){
                value==='desktop'?this.layout='total,sizes,pager,jumper' :this.layout = 'pager'
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
                this.$confirm(`此操作将永久删除该${this.title}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove(row);
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