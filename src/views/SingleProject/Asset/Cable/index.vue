<template>
    <cc-table
        title="线缆"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="3"
    >
        <template>
            <el-table-column
                prop="number"
                label="线缆编号"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="线缆名称"
                align="center"
                show-overflow-tooltip
            >
                <!-- <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template> -->
            </el-table-column>
            <el-table-column
                prop="parentName"
                label="所属主线缆"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.parentName || '-'"
            />
            <el-table-column
                prop="detail"
                label="描述"
                align="center"
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
            remove(row, current){
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
                this.$router.push({name:'NewCable'});
                this.skipToEdit({type,row});
            },
            skipToDetail(row){
                this.$router.push({name:'CableDetail'})
                sessionStorage.setItem('obj',JSON.stringify({
                    deviceType:38,
                    ...row
                }))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>