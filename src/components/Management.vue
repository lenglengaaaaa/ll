<template>
    <div class="Management_container">
        <div class="title_bar">
            <el-button size="small" type="success" @click="linkTo('add')">
                {{btnName}}<i class="el-icon-plus el-icon--right" />
            </el-button>
        </div>
        <div class="body">
            <div class="header">
                <span>{{title}}</span>
                <div>
                    <el-input
                        size="small"
                        :placeholder="placeholder"
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
                    <template v-if="type==='gateway'">
                        <el-table-column 
                            v-for="o in columns" 
                            :key="o.prop"
                            :prop="o.prop"
                            :label="o.label"
                            align="center"
                            sortable
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="最后接收时间"
                            align="center"
                            sortable
                            :formatter="(row)=>this.$moment(row.time).fromNow()"
                        />
                        <el-table-column
                            prop="status"
                            label="状态"
                            align="center"
                            sortable
                        >
                            <template slot-scope="scope" >
                                <el-tag
                                    :type="scope.row.status? 'success' : 'danger'"
                                    disable-transitions
                                >
                                    {{scope.row.status?'已连接':'已断开'}}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column
                            prop="id"
                            label="应用ID"
                            align="center"
                            sortable
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="name"
                            label="应用名称"
                            align="center"
                            sortable
                        >
                            <template slot-scope="scope">
                                <el-link type="primary" @click="linkTo('check',scope.row)">{{scope.row.name}}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="description"
                            label="应用描述"
                            align="center"
                            sortable
                            show-overflow-tooltip
                        />
                    </template>
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
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    :layout="layout"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <NewApplication
            :visible="visible"
            :value="value"
            :close="closeDia"
        />
    </div>
</template>

<script>
    import NewApplication from '@/views/Application/components/NewApplication'

    export default {
        components: {
            NewApplication
        },
        props: {
            type:{
                type:String,
                default:''
            },
            btnName: {
                type: String,
                default:''
            },
            title: {
                type: String,
                default:''
            },
            placeholder: {
                type: String,
                default:''
            },
            data:{
                type:Array,
                default:[]
            },
            columns:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {
                input: '',
                layout:'',
                total:100,
                currentPage:1,
                pageSize:10,
                visible:false,
                value:{}
            }
        },
        mounted () {
            const value = this.$store.state.screenWidth;
            this.resizehandle(value);
        },
        watch: {
            '$store.state.screenWidth'(value) {
                this.resizehandle(value) ;
            }
        },
        methods: {
            resizehandle(value){
                value>769?this.layout='total, sizes,pager,jumper' :this.layout = 'pager'
            },
            handleSizeChange(val) {
                this.currentPage =1;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            closeDia(){
                this.visible = false;
            },
            //应用跳转
            linkTo(type,row={}){
                switch (type) {
                    case 'check':
                        //跳转单个应用管理页面
                        this.$store.commit('SET_APPID',row)
                        this.$router.push({
                            name:'ApplyOverview',
                            params:{
                                type:row.type
                            }
                        })
                        break;
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
                            this.visible = true;
                            this.value = {
                                editFlag:type==='add'?false:true,
                                data:row
                            }
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
                console.log('delete',row)
                const type = this.type==='gateway'?'网关':'应用'
                this.$confirm(`此操作将永久删除该${type}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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

<style lang="scss" >
    @import '@/styles/Management.scss';
</style>