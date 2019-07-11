<template>
    <ApplyMgt
        title="线缆"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="线缆名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="线缆编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="parentId"
                label="是否为主线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.parentId==0?'是':'否'"
            />
            <el-table-column
                prop="linePid"
                label="所属主线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.linePid || '-'"
            />
            <el-table-column
                prop="trapId"
                label="所属井盖"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.trapId || '-'"
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
                    projectId: 1
                }
            }
        },
        mounted () {
            this.getList();
        },
        methods: {
            ...mapActions('asset',[
                'getLineList', 
                'deleteLine'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getLineList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                this.deleteLine(id).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCable'})
                sessionStorage.setItem('assetObj',JSON.stringify({
                    editFlag:type==='edit'?true:false,
                    data:row
                }))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>