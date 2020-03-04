<template>
    <div>
        <cc-table
            title="角色"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            hasCheck
        >
            <template>
                <el-table-column
                    prop="name"
                    label="角色名称"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="parentName"
                    label="父角色"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.parentName || '-'"
                />
                <el-table-column
                    prop="detail"
                    label="角色描述"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.detail || '-'"
                />
                <el-table-column
                    prop="createAccountName"
                    label="创建人"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.createAccountName || '-'"
                />
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')"
                />
            </template>
        </cc-table>
        <CreateEdit
            :visible="dialogVisible"
            :close="close"
            :editFlag="editFlag"
            :value="value"
        />
    </div>
</template>

<script>
    import { judgeLastData } from '@/utils/methods'
    import { mapActions } from 'vuex';
    import CreateEdit from '../components/CreateEdit'
    
    export default {
        components: {
            CreateEdit
        },
        data() {
            return {
                data: [],
                total:0,
                params:{
                    size:20,    
                    current:1   
                },
                dialogVisible:false,
                editFlag:false,
                value:{}
            }
        },
        methods: {
            ...mapActions('permission',[
                'getRoleList',
                'deleteRole'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getRoleList(data).then(res=>{
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
                this.deleteRole(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                if(type==='check'){
                    this.$router.push({name:'Permission'});
                    return;
                }
                this.dialogVisible = true;
                if(type==="edit"){
                    this.editFlag = true;
                    this.value=row;
                }
            },
            close(result){
                this.dialogVisible=false;
                this.editFlag=false;
                this.value  ={};
                if(!result)return;
                this.$children[0]&&this.$children[0].getListData()
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>