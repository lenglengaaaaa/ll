<template>
    <cc-table
        title="井盖"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="4"
    >
        <template>
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
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="lineNames"
                label="附属线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.lineNames || '-'"
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
                'getTrapList', 
                'deleteTrap'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getTrapList(data).then(res=>{
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
                this.deleteTrap(id).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCover'})
                this.skipToEdit({type,row})
            },
            skipToDetail(row){
                this.$router.push({name:'CoverDetail'})
                sessionStorage.setItem('obj',JSON.stringify(row))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>