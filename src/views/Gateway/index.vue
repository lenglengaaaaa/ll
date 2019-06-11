<template>
    <div class="Gateway_container">
        <div class="title_bar">
            <div class="bar_form">
                <el-button size="small" type="success">
                    网关<i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>
        <div class="body">
            <div class="header">
                <span>网关列表</span>
                <div>
                    <el-input
                        size="small"
                        placeholder="搜索网关"
                        suffix-icon="el-icon-search"
                        v-model="input"
                    />
                </div>
            </div>
            <div class="table">
                <el-table
                    :data="tableData"
                    border
                    height="70vh"
                    max-height="70vh"
                >
                    <el-table-column
                        prop="name"
                        label="网关名称"
                        align="center"
                        sortable
                    />
                    <el-table-column
                        prop="number"
                        label="网关编号"
                        align="center"
                        sortable
                    />
                    <el-table-column
                        prop="card"
                        label="卡号"
                        align="center"
                        sortable
                    />
                    <el-table-column
                        prop="mac"
                        label="MAC地址"
                        align="center"
                        sortable
                    />
                    <el-table-column
                        prop="time"
                        label="最后接受时间"
                        align="center"
                        sortable
                        width="200"
                    />
                    <el-table-column
                        prop="status"
                        label="状态"
                        align="center"
                        sortable
                    >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.status? 'success' : 'danger'"
                                disable-transitions
                            >
                                {{scope.row.status?'已连接':'已断开'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="oper"
                        label="操作"
                        align="center"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="success"
                            >
                                编辑
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
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
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                input: '',
                total:100,
                currentPage:1,
                pageSize:10,
                tableData: [
                        {
                            name:'国金源富室内网关',
                            number:'0123456789',
                            card:'0123456789',
                            mac:'8cf957ffff8012f3',
                            time: '2016-05-02',
                            status:0 //0:断开,1:连接
                        },
                        {
                            name:'云南网关433',
                            number:'31900004',
                            card:'31900004',
                            mac:'b827ebfffe2accf5',
                            time: '2016-05-02',
                            status:1 //0:断开,1:连接
                        }
                    ]
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentPage =1;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        },
    }
</script>

<style lang="scss" >
    .Gateway_container{
        height: 100%;
        .title_bar{
            background: #fff;
            padding: 15px 15px;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin-bottom: 15px;
        }
        .body{
            height: calc(100% - 77px);
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .header{
                padding: 15px 0;
                margin: 0 15px;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ebeef5;
            }
            .table{
                padding: 15px;
            }
            .footer{
                widows: 100%;
                padding: 0px 30px;
                display: flex;
                justify-content: flex-end;
                .el-pagination{
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>