<template>
    <div>
        <cc-table
            title="用户"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            hasCheck
        >   
            <template>
                <el-table-column
                    prop="userName"
                    label="用户名称"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="name"
                    label="账号"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="roleName"
                    label="父角色(权限)"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.roleName || '-' " 
                />
                <el-table-column
                    prop="phoneNum"
                    label="手机号码"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.phoneNum || '-' " 
                />
                <el-table-column
                    prop="email"
                    label="邮箱"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.email || '-' " 
                />
                <el-table-column
                    prop="description"
                    label="详情"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.description || '-' " 
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
    import CreateEdit from '../components/CreateEdit'
    import { judgeLastData } from '@/utils/methods'
    import { mapActions } from 'vuex';

    export default {
        components: {
            CreateEdit
        },
        data() {
            return {
                data: [],
                total:0,
                dialogVisible:false,
                editFlag:false,
                value:{},
                params:{
                    size:20,    
                    current:1 ,   
                    projectId: 0
                }
            }
        },
        methods: {
            ...mapActions('user',[
                'getAccountList', 
                'deleteAccount'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getAccountList(data).then(res=>{
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
                this.deleteAccount(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                if(type==='check'){
                    sessionStorage.setItem('obj',JSON.stringify(row));
                    this.$router.push({name:'AccountPermission'});
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