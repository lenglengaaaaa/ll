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
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
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
                        :type="scope.row.remark1 == 1?'': scope.row.remark1 == 2 ?'warning' :'success'"
                    >
                        {{scope.row.remark1 == 1 ? '低压配网柜': scope.row.remark1 == 2? '中高压环网柜': "分支箱" }}
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
                :formatter="(row)=>row.mainComelineName || '-'"
            />
            <!-- <el-table-column
                label="备用进线"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.comeLine || '-'"
            /> -->
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
                type: "1",
                cabinetType:[
                    {label:"低压配网柜", value :"1"},
                    {label:"中高压环网柜", value :"2"},
                    {label:"分支箱", value :"3"},
                ],
            }
        },
        methods: {
            ...mapActions('asset',[
                'skipToEdit',
                'getChestList', 
                'deleteChest',
                'getChestDetail'
            ]),
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
                sessionStorage.setItem('obj',JSON.stringify(row))
                this.$router.push({name:'CabinetDetail'})
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