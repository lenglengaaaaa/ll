<template>
    <ApplyMgt
        title="井盖"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
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
                prop="lineId"
                label="所属主线缆"
                align="center"
                sortable
                show-overflow-tooltip
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
    </ApplyMgt>
</template>

<script>
    import {ApplyMgt} from '@/components/Management'
    import { mapActions } from 'vuex';

    export default {
        components: {
            ApplyMgt,
        },
        data() {
            return {
                data: [],
                total:0,
                params:{
                    size:10,    
                    current:1 ,   
                    projectId:JSON.parse(sessionStorage.getItem('project')).id

                }
            }
        },
        mounted () {
            this.getList();
        },
        methods: {
            ...mapActions('asset',[
                'getTrapList', 
                'deleteTrap'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    current:obj.filterStr?1:this.params.current,
                    ...obj
                }
                this.params = data ;
                this.getTrapList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                this.deleteTrap(id).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCover'})
                sessionStorage.setItem('assetObj',JSON.stringify({
                    editFlag:type==='edit'?true:false,
                    data:row
                }))
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