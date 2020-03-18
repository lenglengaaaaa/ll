<template>
    <div>
        <Management
            type="project"
            title='项目'
            :data="data"
            :total="total"
            :skipTo="skipTo"
            :getList="getList"
            :remove="remove"
            :recover="recover"
        >
            <template>
                <el-table-column
                    prop="id"
                    label="项目ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    className="weight"
                />
                <el-table-column
                    prop="name"
                    label="项目名称"
                    align="center"
                    sortable
                >
                    <template slot-scope="scope">
                        <el-link type="primary" @click="skipToDetail(scope.row)" v-if="!scope.row.isDelete">{{scope.row.name}}</el-link>
                        <span v-else>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    label="所属区域"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="detail"
                    label="项目描述"
                    align="center"
                    sortable
                    show-overflow-tooltip
                    :formatter="(row)=>row.detail || '-'"
                />
            </template>
        </Management>
        <NewProject
            :visible="dialogVisible"
            :close="close"
            :editFlag="editFlag"
            :value="value"
        />
    </div>
</template>

<script>
    import Management from '@/components/Management'
    import NewProject from '@/views/Project/components/NewProject'
    import { judgeLastData } from '@/utils/methods'
    import { mapActions, mapState } from 'vuex'

    export default {
        components: {
            Management,
            NewProject
        },
        data() {
            return {
                data:[],
                total:0,
                dialogVisible:false,
                editFlag:false,
                value:{},
                params:{
                    size:20,    
                    current:1 ,   
                }
            }
        },
        computed: {
            ...mapState('user',[
                'permissionIds',
            ])
        },
        methods: {
            ...mapActions('overall',[
                'getProjectList', 
                'deleteProject',
                'recoveProject'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getProjectList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                this.deleteProject(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            recover(row){
                const {id} = row;
                this.recoveProject(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row){
                this.dialogVisible = true;
                if(type==="edit"){
                    this.editFlag = true;
                    this.value=row;
                }
            },
            skipToDetail(row={}){
                //跳转单个应用管理页面
                sessionStorage.setItem('project',JSON.stringify(row));

                const childMenuIds = ['5','6','7','8','9','10','11','12','13'];
                const hasChildMenu = this.permissionIds.some(item=>{
                    return childMenuIds.includes(item);
                });
                if(hasChildMenu){
                    const hasPowerIds =_.sortBy(this.permissionIds.reduce((pre,cur)=>{
                        if(childMenuIds.includes(cur)){
                            return [...pre,+cur];
                        }
                        return pre
                    },[]));
                    const routeNames = {
                        5:'ProjectOverview',
                        6:'Courts',
                        7:'Room',
                        8:'Cabinet',
                        9:'Cover',
                        10:'Cable',
                        11:'Equipment',
                        12:'Threshold',
                        13:'Alarm',
                    }
                    this.$router.push({name:routeNames[hasPowerIds[0]]})
                }else{
                    this.$message({
                        message: '该用户无项目详情权限,请联系管理员',
                        type: 'warning'
                    });
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

<style lang="scss">
    .weight{
        font-weight: bold;  
    }
</style>