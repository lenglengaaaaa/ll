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
                    v-loading="loading"
                    :data="data"
                    border
                    stripe
                    height="calc(100vh - 289px)"
                    max-height="calc(100vh - 289px)"
                    header-cell-class-name="table_header"
                    ref="manTable"
                >   
                    <slot></slot>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="240"
                    >
                        <template slot-scope="scope">
                            <!-- 用于未激活网关 -->
                            <el-button
                                size="mini"
                                type="success"
                                @click="linkTo('active',scope.row)"
                                v-if="scope.row.isActivate===false"
                            >
                                激活
                            </el-button>

                            <!-- 公有 -->
                            <el-button
                                size="mini"
                                type="primary"
                                @click="linkTo('edit',scope.row)"
                            >
                                编辑
                            </el-button>

                            <!-- 项目管理未删除状态显示为冻结,删除状态显示为恢复 -->
                            <!-- 网关管理不受影响 -->
                            <el-button
                                v-if="type!=='gateway'&&scope.row.isDelete"
                                size="mini"
                                type="success"
                                @click="linkTo('recover',scope.row)"
                            >
                                恢复
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="linkTo('delete',scope.row)"
                                v-else
                            >
                                {{type==='gateway'?'删除':'冻结'}}
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
                    :page-sizes="[20, 30, 50]"
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
            loading:Boolean,
            data:Array,
            total:Number,
            skipTo:Function,
            getList:Function,
            remove:Function,
            active:Function,
            recover:Function
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
                // value==='desktop'?this.layout='total,sizes,pager,jumper' :this.layout = 'pager'
            },
            //切换显示个数
            handleSizeChange(val) {
                this.size = val;
                this.current =1;
                this.getList({ size:val });
                this.$nextTick(()=>{this.$refs.manTable.bodyWrapper.scrollTop = 0 });
            },
            //切页
            handleCurrentChange(val) {
                this.current = val;
                this.getList({ current:val });
                this.$nextTick(()=>{this.$refs.manTable.bodyWrapper.scrollTop = 0 });
            },
            //应用跳转
            linkTo(type,row={}){
                switch (type) {
                    case 'add':
                    case 'edit':
                        this.skipTo(type,row)
                        break;
                    case 'delete' :
                        this.open(row);
                        break;
                    case 'active':
                        this.active(row);
                        break;
                    case 'recover':
                        this.recover(row);
                        break;
                    default:
                        break;
                }
            },
            open(row) {
                const type = this.type==='gateway'?'网关':'应用'
                this.$confirm(`此操作将${type==="应用"?'冻结':'删除'}该${type}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove(row);
                }).catch(action => {
                });
            }
        },
    }
</script>

<style lang="scss" >
    @import '@/styles/management.scss';
</style>