<template>
    <Management
        type="gateway"
        title='网关'
        :data="data"
        :total="total"
        :columns="columns"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :active="active"
    >
        <el-table-column 
            v-for="o in columns" 
            :key="o.prop"
            :prop="o.prop"
            :label="o.label"
            align="center"
            sortable
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            label="激活状态"
            align="center"
            sortable
        >
            <template slot-scope="scope" >
                <el-tag
                    :type="scope.row.isActivate? 'success' : 'danger'"
                    disable-transitions
                >
                    {{scope.row.isActivate?'已激活':'未激活'}}
                </el-tag>
            </template>
        </el-table-column>
    </Management>
</template>

<script>
    import {Management} from '../../components/Management'
    import { mapActions } from 'vuex';

    export default {
        components: {
            Management,
        },
        data() {
            return {
                columns:[
                    { prop: "name" , label: "网关名称" },
                    { prop: "number" , label: "网关编号" },
                    { prop: "card" , label: "卡号" },
                    { prop: "mac" , label: "MAC地址" },
                ],
                data:[],
                total:0,
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
                'getGatewayList',
                'activeGateway',
                'deleteGateway', 
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getGatewayList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            remove(row){
                this.deleteGateway(row).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            active(row){
                this.activeGateway(row).then(res=>{
                    if(!res)return;
                    this.getList(this.params);
                })
            },
            skipTo(type,row){
                this.$router.push({name:'NewGateway'})
                this.$store.dispatch('asset/skipToEdit',{type,row})
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>