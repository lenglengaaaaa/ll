<template>
    <ApplyMgt
        title="权限管理"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="角色名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="description"
                label="角色描述"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="list"
                label="用户列表"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.list || '-'"
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
                data: [{
                    name:'管理员',
                    description:'系统管理员',
                    list:[]
                }],
                total:0,
                params:{
                    size:20,    
                    current:1 ,   
                    parentId:0,
                }
            }
        },
        mounted () {
            // this.getList();
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
            },
            remove(row){
                console.log('删除')
            },
            skipTo(type,row) {
                if(type==='edit'){
                    this.$router.push({name:'Authority'});
                    this.skipToEdit({type,row,storage:'obj'});
                }
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>