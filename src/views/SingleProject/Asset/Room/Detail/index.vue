<template>
    <AssetDetail
        label="附属配电柜"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="number"
                label="配电柜编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="配电柜名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="roomId"
                label="所属配电房"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="mainComeline"
                label="主进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="comeLine"
                label="备用进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="detail"
                label="描述"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
        <template>
            <el-tab-pane label="设备列表" lazy>
                <EquipList 
                    :data="equipList"
                    :getData="getEquipData"
                />
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import EquipList from '@/components/EquipList'
    import { mapActions } from 'vuex'

    export default {
        components: {
            AssetDetail,
            EquipList
        },
        data() {
            return {
                data: [],
                equipList:[],
                params:{
                    size:50,
                    current:1,
                    type:1
                }
            }
        },
        created () {
            const {id,name} =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=name
            this.getList(id);
            this.getEquipList(id);
        },

        methods: {
            ...mapActions('asset',[
                'getChestList',
            ]),
            ...mapActions('equip',[
                'getEquipInAsset',
            ]),
            skipToDetail(row) {
                sessionStorage.setItem('obj',JSON.stringify(row))
                this.$router.push({
                    name:'CabinetDetail'
                })
            },
            //获取附属配电柜列表
            getList(roomId){
                this.getChestList({
                    size:20,
                    current:1,
                    roomId
                }).then(res=>{
                    if(!res)return;
                    this.data = res.data;
                })
            },
            //获取设备列表
            getEquipList(roomId){
                this.getEquipInAsset({
                    ...this.params,
                    roomId
                }).then(res=>{
                    if(!res)return;
                    this.equipList = res;
                })
            },
            //获取设备数据
            getEquipData(){
                console.log('获取设备数据')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>