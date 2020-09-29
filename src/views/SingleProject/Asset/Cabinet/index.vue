<template>
    <cc-table
        title="配电柜"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="1"
    >
        <template #select>
            <div class="equipSelect">
                <el-select v-model="type"  @change="changeType">
                    <el-option
                        v-for="i in cabinetType" 
                        :key="i.value" 
                        :label="i.label" 
                        :value="i.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </template>
        <template>
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
                    <el-link type="primary" @click="skipToDetail(scope.row)" v-if="hasSkipDetail(scope.row)">{{scope.row.name}}</el-link>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="配电柜类型"
                align="center"
                show-overflow-tooltip
                width="154"
            >
                <template slot-scope="scope">
                    <el-tag 
                        :type="scope.row.remark1 == 0?'':'warning'"
                    >
                        {{scope.row.remark1 == 0 ? '低压配网柜': '中高压环网柜' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="courtsName"
                label="所属台区"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                label="所属配电房"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.roomName || '-'"
            />
            <el-table-column
                label="主进线"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.mainComeline || '-'"
            />
            <el-table-column
                label="备用进线"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.comeLine || '-'"
            />
            <el-table-column
                label="描述"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
        </template>
    </cc-table>
</template>

<script>
    import { mapActions, mapState } from 'vuex';

    export default {
        data() {
            return {
                params:{
                    size:20,    
                    current:1 ,   
                    projectId:JSON.parse(sessionStorage.getItem('project')).id
                },
                type: null,
                cabinetType:[
                    {label: "全部类型", value: null },
                    {label:"低压配网柜", value :"0"},
                    {label:"中高压环网柜", value :"1"},
                ],
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
                    return res;
                })
            },
            remove(row,current){
                const { id } = row;
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
                if( Detail ){
                    row.switchList = Detail.switchList;
                    row.formerSwitchList = Detail.switchList;
                };
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
            //切换设备
            changeType(type){
                const data ={
                    ...this.params,
                    remark1:type,
                    current:1
                }
                if(!type) delete data.remark1;
                this.params = data;
                this.$children[0]&&this.$children[0].getListData(data);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .equipSelect{
        padding-right: 10px;
    }
</style>