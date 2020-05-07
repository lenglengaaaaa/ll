<template>
    <cc-table
        title="主线缆"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="6"
    >
        <template>
            <el-table-column
                prop="name"
                label="线缆名称"
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
                label="线缆编号"
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
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                data: [],
                total:0,
                params:{
                    size:20,    
                    current:1 ,   
                    parentId:0,
                }
            }
        },
        methods: {
            ...mapActions('asset',[
                'skipToEdit',
                'getLineList', 
                'deleteLine'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getLineList(data).then(res=>{
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
                this.deleteLine(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewMainLine'});
                this.skipToEdit({type,row});
            },
            skipToDetail(row){
                this.$router.push({name:'MainLineDetail'})
                sessionStorage.setItem('mainLine',JSON.stringify(row))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>