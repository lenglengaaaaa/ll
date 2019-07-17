<template>
    <AssetDetail
        label="附属井盖"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="number"
                label="井盖编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="井盖名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <!-- <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template> -->
            </el-table-column>
            <el-table-column
                prop="lineId"
                label="所属主线缆"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="detail"
                label="资产描述"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'

    export default {
        components: {
            AssetDetail
        },
        data() {
            return {
                data: [],
            }
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("obj"));
            this.$store.dispatch('asset/getLineBelowTrap',obj.id).then(res=>{
                if(!res)return;
                this.data = res.data;
            })
        },
        methods: {
            // skipToDetail(row) {
            //     this.$router.push({ name:'RoomDetail'})
            //     sessionStorage.setItem('obj',JSON.stringify(row))
            // }
        },
    }
</script>

<style lang="scss" scoped>

</style>