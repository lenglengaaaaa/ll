<template>
    <cc-table
        title="台区"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="5"
    >
        <template>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="所属断路柜">
                                    <span>{{ props.row.cutoff || '---' }}</span>
                                </el-form-item>
                                <el-form-item label="变压前电压">
                                    <span>{{ props.row.beforeVoltage || '---' }}</span>
                                </el-form-item>
                                <el-form-item label="变压后电压">
                                    <span>{{ props.row.afterVoltage || '---' }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="电流等级">
                                    <span>{{ props.row.electricityLevel || '---' }}</span>
                                </el-form-item>
                                <el-form-item label="电压等级">
                                    <span>{{ props.row.covoltageLevel || '---' }}</span>
                                </el-form-item>
                                <el-form-item label="台区描述">
                                    <span>{{ props.row.detail || '---' }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                label="台区编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="台区名称"
                align="center"
                sortable
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="courtsType"
                label="台区类型"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="mainComeline"
                label="主进线"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="comeLine"
                label="备用进线"
                align="center"
                sortable
                show-overflow-tooltip
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
                'getCourtsList', 
                'deleteCourts'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getCourtsList(data).then(res=>{
                    if(!res)return;
                    return res;
                })
            },
            remove(row,current){
                const {id} = row;
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteCourts(id).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCourts'});
                this.skipToEdit({type,row})
            },
            skipToDetail(row){
                this.$router.push({name:'CourtsDetail',})
                sessionStorage.setItem('obj',JSON.stringify(row))
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>