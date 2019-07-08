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
                prop="rid"
                label="编码"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="名称"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="temp"
                label="温度(℃)"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="v"
                label="电压(V)"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="a"
                label="电流(A)"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="bat"
                label="电池电压(V)"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="rssi"
                label="信号"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="time"
                label="数据上传时间"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>this.$moment(row.time).format('YYYY-MM-DD HH:mm:ss')"
            />
        </el-table>
</template>

<script>
    export default {
        data() {
            return {
                data: [{
                    rid:'0776',
                    name:'魔戒',
                    temp:'29.9',
                    v:'41.8',
                    a:'67.1',
                    bat:'3.58',
                    rssi:'-71',
                    tiem:1561714114536
                }]
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>