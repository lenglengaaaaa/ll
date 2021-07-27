<template>
    <cc-table
        title="电缆通道"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="3"
    >
        <template>
            <el-table-column
                prop="number"
                label="电缆通道编号"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="电缆通道名称"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="detail"
                label="描述"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.detail || '-'"
            />
            <!-- <el-table-column
                prop="location"
                label="位置信息"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.location || '-'"
            /> -->
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
                'getCableTrenchList', 
                'editAndDeleteCableTrench'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getCableTrenchList(data).then(res=>{
                    if(!res)return;
                    return res;
                })
            },
            remove(row, current){
                this.params ={
                    ...this.params,
                    current
                }
                this.editAndDeleteCableTrench({
                    ...row,
                    isDelete:1
                }).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCableTrench'});
                this.skipToEdit({type,row});
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>