<template>
    <ApplyMgt
        title="线缆"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template>
            <el-table-column
                prop="name"
                label="线缆名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="线缆编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="parentId"
                label="是否为主线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.parentId==0?'是':'否'"
            />
            <el-table-column
                prop="linePid"
                label="所属主线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.linePid || '-'"
            />
            <el-table-column
                prop="trapId"
                label="所属井盖"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.trapId || '-'"
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

    export default {
        components: {
            ApplyMgt,
        },
        data() {
            return {
                data: [
                    {
                        name:'演示平台',
                        number:'0049',
                        parentId:"1",
                        lineId:'0',
                        trapId:'0',
                        detail:'Hello'
                    }
                ],
                total:100
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            skipTo(type,row) {
                this.$router.push({name:'NewCable'})
                //修改资产类型
                this.$store.dispatch('app/setAsset',4)
                this.$store.dispatch('app/setEdit',{
                    editFlag:type==='edit'?true:false,
                    data:row
                })
            },
            remove(){
                console.log('删除')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>