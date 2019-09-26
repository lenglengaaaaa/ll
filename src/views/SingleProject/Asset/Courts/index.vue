<template>
    <cc-table
        title="台区"
        :loading="loading"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="true"
        :assetType="5"
    >
        <template>
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
            <el-table-column
                prop="cutoff"
                label="所属断路柜"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.cutoff || '-'"
            />
            <el-table-column
                prop="beforeVoltage"
                label="变压前电压"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.beforeVoltage || '-'"
            />
            <el-table-column
                prop="afterVoltage"
                label="变压后电压"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.afterVoltage || '-'"
            />
            <el-table-column
                prop="electricityLevel"
                label="电流等级"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.electricityLevel || '-'"
            />
            <el-table-column
                prop="covoltageLevel"
                label="电压等级"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.covoltageLevel || '-'"
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
    </cc-table>
</template>

<script>
    import { judgeLastData } from '@/utils/methods'
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                loading:true,
                data: [],
                total:0,
                params:{
                    size:20,    
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
                'skipToEdit',
                'getCourtsList', 
                'deleteCourts'
            ]),
            getList(obj={}){
                this.loading = true;
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getCourtsList(data).then(res=>{
                    this.loading = false;
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
                this.deleteCourts(id).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
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