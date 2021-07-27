<template>
    <cc-assetDetail
        label="附属井盖"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="trapId"
                label="井盖编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="trapName"
                label="井盖名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.trapName}}</el-link>
                </template>
            </el-table-column>
        </template>
    </cc-assetDetail>
</template>

<script>
    export default {
        data() {
            return {
                data: [],
            }
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("mainLine"));
            this.$store.dispatch('asset/getLineBelowTrap',obj.id).then(res=>{
                if(!res)return;
                this.data = res;
            })
        },
        methods: {
            skipToDetail(row) {
                this.$router.push({ name:'MainTrap'})
                sessionStorage.setItem('obj',JSON.stringify(row))
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>