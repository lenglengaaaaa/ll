<template>
    <ApplyMgt
        title="设备"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
    >
        <template #select>
            <div class="equipSelect">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </template>
        <template>
            <el-table-column
                prop="type"
                label="设备类型"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="eui"
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="number"
                label="设备编号"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="courtsId"
                label="所属台区"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.courtsId || '-'"
            />
            <el-table-column
                prop="cabinetId"
                label="所属配电柜"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.cabinetId || '-'"
            />
            <el-table-column
                prop="coverId"
                label="所属井盖"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.coverId || '-'"
            />
            <el-table-column
                prop="lineId"
                label="所属线缆"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.lineId || '-'"
            />
            <el-table-column
                prop="magicId"
                label="所属魔节"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.magicId || '-'"
            />
            <el-table-column
                prop="cenId"
                label="所属集中器"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.cenId || '-'"
            />
            <el-table-column
                prop="address"
                label="位置信息"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.address || '-'"
            />
            <el-table-column
                prop="time"
                label="创建时间"
                align="center"
                sortable
                :formatter="(row)=>this.$moment(row.time).fromNow()"
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
                types:[
                    {label:'魔节',value:0},
                    {label:'线缆温度传感器',value:1},
                    {label:'红外门禁传感器',value:2},
                    {label:'液位传感器',value:3},
                    {label:'烟感传感器',value:4},
                    {label:'集中器',value:5},
                    {label:'魔戒',value:6},
                ],
                value:0,
                data: [
                    {
                        type:'集中器',
                        id:110,
                        name:'集中器0049',
                        number:'0049',
                        eui:'47cb14a300490049',
                        pattern:'0',
                        coverId:'0',
                        lineId:'0',
                        time:'2018-05-12 11:11:11',
                        isBelongCover:false
                    }
                ],
                total:100
            }
        },
        watch: {
            value(newValue, oldValue) {
                console.log(newValue,'value')
            }
        },
        methods: {
            getList(){
                console.log('获取数据')
            },
            skipTo(type,row) {
                this.$router.push({name:'NewEqu',})
                //修改设备类型
                this.$store.dispatch('app/setType',row.type)
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
    .equipSelect{
        padding-right: 10px;
    }
</style>