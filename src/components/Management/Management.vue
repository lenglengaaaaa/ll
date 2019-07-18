<template>
    <div class="Management_container">
        <div class="title_bar">
            <el-button size="small" type="success" @click="linkTo('add')">
                新增{{title}}<i class="el-icon-plus el-icon--right" />
            </el-button>
        </div>
        <div class="body">
            <div class="header">
                <span>我的{{title}}</span>
                <div>
                    <el-input
                        size="small"
                        :placeholder="`搜索${title}`"
                        suffix-icon="el-icon-search"
                        v-model="input"
                    />
                </div>
            </div>
            <div class="table">
                <el-table
                    :data="data"
                    border
                    stripe
                    height="68.5vh"
                    max-height="68.5vh"
                    header-cell-class-name="table_header"
                >   
                    <slot></slot>
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
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            type:String,
            title:String,
            data:Array,
            total:Number,
            skipTo:Function,
            getList:{
                type:Function,
                default:()=>{}
            },
            remove:{
                type:Function,
                default:()=>{}
            },
        },
        data() {
            return {
                input: '',
                layout:'total, sizes,pager,jumper',
                current:1,
                size:20,
            }
        },
        mounted () {
            const value = this.$store.state.app.device;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.app.device'(value) {
                this.resizehandle(value);
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
                    case 'add':
                    case 'edit':
                        if(this.type==='gateway'){
                            this.$router.push({
                                name:'NewGateway',
                                params:{
                                    editFlag:type==='add'?false:true,
                                    data:row
                                }
                            })
                        }else{
                            this.skipTo(type,row)
                        }
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
                    this.remove(row);
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

<style lang="scss" >
    @import '@/styles/management.scss';
</style>