<template>
    <cc-table
        title="配电柜"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="1"
    >
        <template>
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
                    <el-link type="primary" @click="skipToDetail(scope.row)" v-if="hasSkipDetail(scope.row)">{{scope.row.name}}</el-link>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="roomName"
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
    </cc-table>
</template>

<script>
    import { judgeLastData } from '@/utils/methods'
    import { mapActions, mapState } from 'vuex';

    export default {
        data() {
            return {
                data: [],
                total:0,
                params:{
                    size:20,    
                    current:1 ,   
                    projectId:JSON.parse(sessionStorage.getItem('project')).id
                }
            }
        },
        computed: {
            ...mapState('user',[
                'permissionVO',
            ])
        },
        methods: {
            ...mapActions('asset',[
                'skipToEdit',
                'getChestList', 
                'deleteChest',
                'getChestDetail'
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
            /**
             * 是否拥有数据导出功能(魔戒数据)
             * @param row 单个数据
             */
            hasExport(row){
                const { chestPermissionList } = this.permissionVO;

                const filterArr  = chestPermissionList.filter( item=> item.assetId == row.id );
                if( !filterArr.length ) return false;
                return filterArr[0].permissionIds.split(',').includes("46");
            },
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getChestList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                const current = judgeLastData(this.data,this.params.current);
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteChest(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            async skipTo(type,row) {
                //获取出现数量 & 名称
                const Detail = row.id && await this.getChestDetail(row.id);
                if( Detail ) row.switchList = Detail.switchList;
                this.skipToEdit({ type, row });
                await this.$router.push({ name:'NewCabinet' });

            },
            skipToDetail(row){
                this.$router.push({name:'CabinetDetail'})
                sessionStorage.setItem('obj',JSON.stringify({
                    ...row,
                    hasExport:this.hasExport(row)
                }))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>