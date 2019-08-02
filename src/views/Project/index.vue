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
        >
            <template>
                <el-table-column
                    prop="id"
                    label="项目ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="name"
                    label="项目名称"
                    align="center"
                    sortable
                >
                    <template slot-scope="scope">
                        <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
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
    import {Management} from '@/components/Management'
    import NewProject from '@/views/Project/components/NewProject'
    import { judgeLastData } from '@/utils/methods'
    import {mapActions} from 'vuex'

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
        mounted () {
            this.getList();
        },
        methods: {
            ...mapActions('overall',[
                'getProjectList', 
                'deleteProject'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getProjectList(data).then(res=>{
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
                this.deleteProject(id).then(res=>{
                    if(!res)return;
                    this.getList();
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
                this.$router.push({name:'ProjectOverview'})
            },
            close(result){
                this.dialogVisible=false;
                this.editFlag=false;
                this.value  ={};
                if(!result)return;
                this.getList(this.params);
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>