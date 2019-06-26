<template>
    <ApplyMgt
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="设备编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="eui"
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
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
            <el-table-column
                prop="time"
                label="最后接收时间"
                align="center"
                sortable
                :formatter="(row)=>this.$moment(row.time).fromNow()"
            />
        </template>
    </ApplyMgt>
</template>

<script>
    import {ApplyMgt} from '@/components/Management'

    export default {
        components: {
            ApplyMgt,
        },
        data() {
            return {
                data: [
                    {
                        type:5,
                        id:110,
                        name:'集中器0049',
                        number:'0049',
                        eui:'47cb14a300490049',
                        pattern:'0',
                        status:1,
                        coverId:'0',
                        lineId:'0',
                        time:'2018-05-12 11:11:11'
                    }
                ],
                total:100
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            skipTo(type,row) {
                this.$router.push({name:'NewEqu',})
                //修改设备类型
                this.$store.dispatch('app/setType',row.type)
                this.$store.dispatch('app/setEdit',{
                    editFlag:type==='edit'?true:false,
                    data:row
                })
            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>