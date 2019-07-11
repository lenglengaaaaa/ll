<template>
    <ApplyMgt
        title="台区"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
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
            />
            <el-table-column
                prop="beforeVoltage"
                label="变压前电压"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="afterVoltage"
                label="变压后电压"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="electricityLevel"
                label="电流等级"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="covoltageLevel"
                label="电压等级"
                align="center"
                sortable
                show-overflow-tooltip
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
                'getCourtsList', 
                'deleteCourts'
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getCourtsList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                const {id} = row;
                this.deleteCourts(id).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCourts'})
                //修改资产类型
                sessionStorage.setItem('assetObj',JSON.stringify({
                    editFlag:type==='edit'?true:false,
                    data:row
                }))
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