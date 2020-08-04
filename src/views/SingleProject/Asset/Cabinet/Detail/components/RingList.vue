<template>
        <el-table
            :data="data"
            border
            stripe
            height="77.5vh"
            max-height="77.5vh"
            header-cell-class-name="table_header"
            v-loading="switchLoading"
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >   
            <el-table-column
                label="设备地址域"
                align="center"
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
                label="相序"
                align="center"
                width="60"
                :formatter="(row)=>(row && row.outLineName) || '-'"
            />
            <el-table-column
                label="温度(℃)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.decodeHex && row.data.decodeHex.lineTemp ) || '-'"
            />
            <el-table-column
                label="线缆电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.decodeHex && `${row.data.decodeHex.lineV}` ) || '-'"
            />
            <el-table-column
                label="线缆电流(A)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.decodeHex && `${row.data.decodeHex.lineA}` ) || '-'"
            />
            <el-table-column
                label="电池电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.decodeHex && row.data.decodeHex.batteryV ) || '-'"
            />
            <el-table-column
                label="信号强度"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.decodeHex && row.data.decodeHex.signal ) || '-'"
            />
            <el-table-column
                prop="time"
                label="数据上传时间"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>
                    ( row.data && row.data.createTime && this.$moment(row.data.createTime).format('YYYY-MM-DD HH:mm:ss')) || '-'
                "
            />
        </el-table>
</template>

<script>
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
            switchLoading:Boolean
        },
        mounted () {
            this.getList(this.switchList);
        },
        watch: {
            switchList(list) {
                this.getList(list);
            }
        },
        methods:{
            getList(list){
                if( !list.length ) return;

                this.data = list.reduce((pre,current)=>{
                    return [...pre,...current.outLineList]
                },[]).reduce((pre,current)=>{
                    if(!current.deviceId)return pre;
                    return [...pre,current]
                },[])
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>