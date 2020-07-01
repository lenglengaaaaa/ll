<template>
    <div>
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
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
                column-key="typeName"
                :filters="equipTypeMenu"
                :filter-method="filterHandler"
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
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
                show-overflow-tooltip
            />
            <el-table-column
                prop="deviceEui"
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
            />
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
        name:'cc-equipList',
        components: {
            EquipDetail,
        },
        props:{
            data:Array,
            getList:Function
        },
        data() {
            return {
                detailFlag:false,
                loading:false
            }
        },
        mounted () {
            const {id,trapId} =JSON.parse(sessionStorage.getItem("obj"));
            this.getListData(trapId || id);
        },
        computed: {
            equipTypeMenu() {
                const menus = this.$store.state.equip.equipTypeMenu;
                return menus.map( item =>{
                    return {
                        text:item.value,
                        value:item.value
                    }
                })
            }
        },
        methods: {
            //获取数据
            async getListData(id){
                this.loading = true;
                await this.data;
                await this.getList(id)
                this.loading = false;
            },
            skipToList(){
                this.detailFlag = false;
            },
            skipToDetail(row) {
                sessionStorage.setItem('equipObj',JSON.stringify(row))
                this.detailFlag = true;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            }
        },
    }
</script>

<style lang="scss">
    .Equip_Detail{
        .wrap{
            border: 1px solid #e4e7ed;
        }
    }
</style>