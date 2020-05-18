<template>
    <cc-assetDetail
        label="附属配电柜"
        :data="data"
    >
        <template #column>
            <el-table-column
                prop="number"
                label="配电柜编号"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="配电柜名称"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link 
                        type="primary"
                        @click="skipToDetail(scope.row)" 
                        v-if="hasSkip && hasSkipDetail(scope.row)"
                    >
                        {{scope.row.name}}
                    </el-link>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="roomId"
                label="所属配电房"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="mainComeline"
                label="主进线"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="comeLine"
                label="备用进线"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="detail"
                label="描述"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
        <template>
            <el-tab-pane label="设备列表" lazy>
                <cc-equipList 
                    :data="equipList"
                    :getList="getEquipList"
                />
            </el-tab-pane>
            <el-tab-pane label="数据视图" lazy>
                <DataDetail
                    :assetType="1"
                />
            </el-tab-pane>
        </template>
    </cc-assetDetail>
</template>

<script>
    import DataDetail from '@/components/DataDetail'
    import { mapActions, mapState } from 'vuex'

    export default {
        components: {
            DataDetail
        },
        data() {
            return {
                data: [],
                equipList:[],
                params:{
                    size:100,
                    current:1,
                    type:1
                }
            }
        },
        computed: {
            ...mapState('user',[
                'permissionIds',
                'permissionVO',
            ]),
            hasSkip(){    
                return this.permissionIds.includes("8")
            }
        },
        created () {
            const {id,name} =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=name
            this.getList(id);
        },
        methods: {
            ...mapActions('asset',[
                'getChestList',
            ]),
            ...mapActions('equip',[
                'getEquipInAsset',
            ]),
            /**
             * 是否拥有跳转到设备视图的权限
             * @param row 单个数据
             */
            hasSkipDetail(row){
                const { chestPermissionList } = this.permissionVO;

                const filterArr  = chestPermissionList.filter( item=> item.assetId == row.id );
                if( !filterArr.length ) return false;
                return filterArr[0].permissionIds.split(',').includes("45");
            },
            //跳转到配电柜中
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
                return this.getEquipInAsset({
                    ...this.params,
                    roomId
                }).then(res=>{
                    if(!res)return;
                    this.equipList = res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>