<template>
    <div>
        <cc-table
            title="应用"
            :data="data"
            :total="total"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :verify="false"
        >   
            <template>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="coap链接方式">
                                        <span>{{ props.row.coapWay || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="mqtt链接方式">
                                        <span>{{ props.row.mqttWay || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="AgentLite链接方式">
                                        <span>{{ props.row.agentliteWay || '---' }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="https链接方式">
                                        <span>{{ props.row.httpsWay || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="描述">
                                        <span>{{ props.row.detail || '---' }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="appId"
                    label="应用ID"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="name"
                    label="应用名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appKey"
                    label="应用密钥"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="appType"
                    label="应用类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="netModel"
                    label="入网类型"
                    align="center"
                    sortable
                    show-overflow-tooltip
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
    import CreateEdit from './components/CreateEdit'
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
                    current:1,
                    filerstr:""
                }
            }
        },
        methods: {
            ...mapActions('senior',[
                'getAppList', 
                'deleteApp'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getAppList(data).then(res=>{
                    if(!res)return;
                    return res;
                })
            },
            skipTo(type,row) {
                this.dialogVisible = true;
                if(type==="edit"){
                    this.editFlag = true;
                    this.value=row;
                }
            },
            remove(row,current){
                const {id} = row;
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteApp(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            close(result){
                this.dialogVisible=false;
                this.editFlag=false;
                this.value  ={};
                if(!result)return;
                this.$children[0]&&this.$children[0].getListData()
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>