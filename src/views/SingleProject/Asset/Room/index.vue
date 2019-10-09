<template>
    <cc-table
        title="配电房"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="2"
    >
        <template>
            <el-table-column
                prop="number"
                label="配电房编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="配电房名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="courtsName"
                label="所属台区"
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
    import { mapActions } from 'vuex';

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
        methods: {
            ...mapActions('asset',[
                'skipToEdit',
                'getRoomList', 
                'deleteRoom'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getRoomList(data).then(res=>{
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
                this.deleteRoom(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewRoom'})
                this.skipToEdit({type,row})
            },
            skipToDetail(row){
                this.$router.push({name:'RoomDetail'})
                sessionStorage.setItem('obj',JSON.stringify(row))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>