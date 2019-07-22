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
                <el-select v-model="value" placeholder="请选择" @change="changeEquip">
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
                prop="deviceType"
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
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)" v-if="scope.row.type===0">{{scope.row.name}}</el-link>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="deviceEUI"
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="deviceNo"
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
                prop="chestId"
                label="所属配电柜"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.chestId || '-'"
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
            <!-- <el-table-column
                prop="location"
                label="位置信息"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.location || '-'"
            /> -->
            <!-- <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
                sortable
                :formatter="(row)=>this.$moment(row.createTime).fromNow()"
            /> -->
        </template>
    </ApplyMgt>
</template>

<script>
    import {ApplyMgt} from '@/components/Management'
    import { mapActions } from 'vuex';

    const deviceType ={
        20: "氧气传感器",
        21: "臭氧传感器",
        22: "H2S传感器",
        23: "一氧化碳传感器",
        24: "温湿度传感器",
        25: "烷类传感器",
        26: "振动传感器",
        27: "100KV线缆传感器（U,V,W相，电流，电压）",
        28: "S800(红外，液位，烟感)传感器平台",
        30: "电缆监测终端(魔节)",
        31: "局放传感器",
        32: "红外传感器",
        33: "低压集中器",
        35: "烟雾传感器",
        37: "水浸传感器",
        36: "低压传感器(魔戒)",
        38: "线缆温度传感器",
        39: "倾角传感器",
    }

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
                        type:0,
                        deviceType:'魔节',
                        id:110,
                        name:'集中器0049',
                        deviceNo:'0049',
                        deviceEUI:'47cb14a300490049',
                        pattern:'0',
                        trapId:'0',
                        lineId:'0',
                        createTime:'2018-05-12 11:11:11',
                        location:'广东,深圳市,罗湖区,中科研究院'
                    }
                ],
                total:0,
                params:{
                    size:20,    
                    current:1 ,   
                    type:0,
                    projectId:JSON.parse(sessionStorage.getItem('project')).id
                }
            }
        },
        mounted () {
            // this.getList();
        },
        methods: {
            ...mapActions('equip',[

            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    current:obj.filterStr?1:this.params.current,
                    ...obj
                }
                this.params = data ;
                // this.getLineList(data).then(res=>{
                //     if(!res)return;
                //     const {data,page} = res;
                //     this.data = data;
                //     this.total = page.total;
                // })
            },
            //切换设备
            changeEquip(type){
                const data ={
                    ...this.params,
                    type
                }
                this.params = data;
                this.getList(data)
            },
            skipTo(type,row) {
                this.$router.push({name:'NewEqu'});
                sessionStorage.setItem('appType',row.type);
                this.$store.dispatch('asset/skipToEdit',{type,row,storage:'equipObj'})
            },
            skipToDetail(row){
                this.$router.push({name:'EquDetail'})
                sessionStorage.setItem('obj',JSON.stringify(row))
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