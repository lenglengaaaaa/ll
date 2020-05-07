<template>
    <cc-table
        title="井盖"
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
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
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
                    return res;
                })
            },
            remove(row,current){
                const {id} = row;
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteTrap(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
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