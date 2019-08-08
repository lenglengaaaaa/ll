<template>
    <div>
        <el-table
            :data="data"
            border
            stripe
            height="77.5vh"
            max-height="77.5vh"
            header-cell-class-name="table_header"
            v-if="!detailFlag"
        >   
            <el-table-column
                prop="typeName"
                label="设备类型"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                label="设备编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="deviceEui"
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <!-- <el-table-column
                prop="courtsId"
                label="所属台区"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.courtsId || '-'"
            />
            <el-table-column
                prop="chestId"
                label="所属配电柜"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.chestId || '-'"
            />
            <el-table-column
                prop="trapId"
                label="所属井盖"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.trapId || '-'"
            />
            <el-table-column
                prop="lineId"
                label="所属线缆"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.lineId || '-'"
            />
            <el-table-column
                prop="magicId"
                label="所属魔节"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.magicId || '-'"
            />
            <el-table-column
                prop="cenId"
                label="所属集中器"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.cenId || '-'"
            /> -->
        </el-table>
        <div v-else>
            <EquipDetail 
                :hasClose="true"
                :close="skipToList"
            />
        </div>
    </div>
</template>

<script>
    import EquipDetail from '@/components/EquipDetail'

    export default {
        components: {
            EquipDetail,
        },
        props:{
            data:Array,
        },
        data() {
            return {
                detailFlag:false,
            }
        },
        methods: {
            skipToList(){
                this.detailFlag = false;
            },
            skipToDetail(row) {
                this.detailFlag = true;
                sessionStorage.setItem('obj',JSON.stringify(row))
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>