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
                prop="id"
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
                label="温度(℃)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.CBtemp) || '-'"
            />
            <el-table-column
                label="电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.v) || '-'"
            />
            <el-table-column
                label="电流(A)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.a) || '-'"
            />
            <el-table-column
                label="电池电压(V)"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.bat) || '-'"
            />
            <el-table-column
                label="信号"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>(row.data && row.data.rssi) || '-'"
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
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                data: [],
                params:{
                    size:50,
                    current:1,
                    type:0
                }
            }
        },
        mounted () {
            const {id} = JSON.parse(sessionStorage.getItem('obj'));
            this.getEquipInAsset({
                ...this.params,
                chestId:id
            }).then(res=>{
                if(!res)return;
                this.data = res;
            });
        },
        methods: {
            ...mapActions('equip',[
                'getEquipInAsset',
            ]),
            selectRing(index) {
                this.highlight = index;
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>