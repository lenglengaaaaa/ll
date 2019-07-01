<template>
    <Management
        type="gateway"
        title='网关'
        :columns="columns"
        :data="data"
    >
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
    </Management>
</template>

<script>
    import {Management} from '../../components/Management'

    export default {
        components: {
            Management,
        },
        data() {
            return {
                columns:[
                    { prop: "name" , label: "网关名称" },
                    { prop: "number" , label: "网关编号" },
                    { prop: "card" , label: "卡号" },
                    { prop: "mac" , label: "MAC地址" },
                ],
                data:[
                        {
                            name:'国金源富室内网关',
                            number:'0123456789',
                            card:'0123456789',
                            mac:'8cf957ffff8012f3',
                            time: '2018-06-12 11:11:11',
                            address:'中科研究院',
                            status:0 //0:断开,1:连接
                        },
                        {
                            name:'云南网关433',
                            number:'31900004',
                            card:'31900004',
                            mac:'b827ebfffe2accf5',
                            time: '2018-05-12 11:11:11',
                            address:'中科研究院',
                            status:1 //0:断开,1:连接
                        }
                ]
            }
        },
        mounted () {
        },
    }
</script>

<style lang="scss" scoped>

</style>