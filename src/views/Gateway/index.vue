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
            prop="updateAt"
            label="最后接收时间"
            align="center"
            sortable
            :formatter="(row)=>this.$moment(row.updateAt).fromNow()"
        />
        <el-table-column
            label="状态"
            align="center"
            sortable
        >
            <template slot-scope="scope" >
                <el-tag
                    :type="scope.row.gatewayStatus? 'success' : 'danger'"
                    disable-transitions
                >
                    {{scope.row.gatewayStatus?'已连接':'已断开'}}
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
                    { prop: "gatewayName" , label: "网关名称" },
                    { prop: "gatewayNo" , label: "网关编号" },
                    { prop: "gatewayCard" , label: "卡号" },
                    { prop: "gatewayMac" , label: "MAC地址" },
                ],
                data:[
                        {
                            gatewayName:'国金源富室内网关',
                            gatewayNo:'0123456789',
                            gatewayCard:'0123456789',
                            gatewayMac:'8cf957ffff8012f3',
                            updateAt: '2018-06-12 11:11:11',
                            gatewaySite:'中科研究院',
                            gatewayStatus:0 //0:断开,1:连接
                        },
                        {
                            gatewayName:'云南网关433',
                            gatewayNo:'31900004',
                            gatewayCard:'31900004',
                            gatewayMac:'b827ebfffe2accf5',
                            updateAt: '2018-05-12 11:11:11',
                            gatewaySite:'中科研究院',
                            gatewayStatus:1 //0:断开,1:连接
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