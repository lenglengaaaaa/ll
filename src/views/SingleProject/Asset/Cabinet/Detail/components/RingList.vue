<template>
        <el-table
            :data="data"
            border
            stripe
            height="77.5vh"
            max-height="77.5vh"
            header-cell-class-name="table_header"
        >   
            <el-table-column
                label="设备地址域"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>(row && row.deviceAdress) || '-'"
            />
            <el-table-column
                label="名称"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row && row.deviceName) || '-'"
            />
            <el-table-column
                label="温度(℃)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data&&row.data.dataJSON&&row.data.dataJSON.temp ) || '-'"
            />
            <el-table-column
                label="电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data&&row.data.dataJSON&&row.data.dataJSON.lineV ) || '-'"
            />
            <el-table-column
                label="电流(A)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data&&row.data.dataJSON&&row.data.dataJSON.lineA ) || '-'"
            />
            <el-table-column
                label="电池电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data&&row.data.dataJSON&&row.data.dataJSON.batteryA ) || '-'"
            />
            <el-table-column
                label="信号"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data&&row.data.dataJSON&&row.data.dataJSON.signal ) || '-'"
            />
            <el-table-column
                prop="time"
                label="数据上传时间"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>
                    (row.data&&row.data.createTime&&this.$moment(row.data.createTime).format('YYYY-MM-DD HH:mm:ss')) || '-'
                "
            />
        </el-table>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                data: []
            }
        },
        props: {
            switchList: {
                type: Array,
                default: []
            },
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('obj'));
            const result = this.switchList.reduce((pre,current)=>{
                return [...pre,...current.outLineList]
            },[])
            this.data = result;
        },
        methods: {
            ...mapActions('equip',[
                'getRingDetail'
            ]),
        },
    }
</script>

<style lang="scss" scoped>

</style>