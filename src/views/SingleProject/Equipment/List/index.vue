<template>
    <ApplyMgt
        title="设备"
        :loading="loading"
        :data="data"
        :total="total"
        :getList="getList"
        :skipTo="skipTo"
        :remove="remove"
        :verify="false"
    >
        <template #select>
            <div class="equipSelect">
                <el-select v-model="value" placeholder="请选择" @change="changeEquip">
                    <el-option
                        v-for="item in types"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>
        </template>
        <template>
            <el-table-column
                prop="typeName"
                label="设备类型"
                align="center"
                width="200"
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="设备名称"
                align="center"
                sortable
                show-overflow-tooltip
                width="200"
            >
                <template slot-scope="scope">
                    <el-link 
                        type="primary" 
                        @click="skipToDetail(scope.row)" 
                    >
                        {{scope.row.name}}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
                width="160"
                :formatter="(row)=>row.deviceEui || '-'"
            />
            <el-table-column
                prop="number"
                label="设备编号"
                align="center"
                sortable
                width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="deviceAdress"
                label="设备地址域"
                align="center"
                sortable
                width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="courtsName"
                label="所属台区"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.courtsName || '-'"
            />
            <el-table-column
                prop="roomName"
                label="所属配电房"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.roomName || '-'"
            />
            <el-table-column
                prop="chestName"
                label="所属配电柜"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.chestName || '-'"
            />
            <el-table-column
                prop="trapName"
                label="所属井盖"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.trapName || '-'"
            />
            <el-table-column
                prop="lineName"
                label="所属线缆"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.lineName || '-'"
            />
            <el-table-column
                label="所属魔节"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>( row.parentType==30&&row.parentName )|| '-'"
            />
            <el-table-column
                label="所属集中器"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>( row.parentType==33&&row.parentName )|| '-'"
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
    import { judgeLastData } from '@/utils/methods'
    import { mapActions } from 'vuex';

    export default {
        components: {
            ApplyMgt,
        },
        data() {
            return {
                loading:true,
                value:null,
                types:[],
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
            this.getEquipType();
            this.getList();
        },
        methods: {
            ...mapActions('equip',[
                'getEquipList',
                'deleteEquip'
            ]),
            //获取设备列表
            getList(obj={}){
                this.loading = true;
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getEquipList(data).then(res=>{
                    this.loading = false;
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            //获取设备类型
            getEquipType(){
                const equipTypeMenu = this.$store.state.equip.equipTypeMenu;
                const result = [
                    {
                        "id": null,
                        "value": "全部设备",
                    },
                    ...equipTypeMenu
                ]
                this.types = result;
            },
            //切换设备
            changeEquip(deviceType){
                const data ={
                    ...this.params,
                    deviceType,
                    current:1
                }
                if(!deviceType) delete data.deviceType;
                this.params = data;
                this.getList(data)
            },
            skipTo(type,row) {
                this.$store.dispatch('asset/skipToEdit',{
                    type,
                    row,
                    storage:'equipObj',
                    deviceType:row.deviceType
                })
                if(type==='set'){
                    this.$router.push({name:'DeviceThSet'});
                    return;
                }
                this.$router.push({name:'NewEqu'});
            },
            skipToDetail(row){
                this.$router.push({name:'EquDetail'})
                sessionStorage.setItem('equipObj',JSON.stringify(row))
            },
            //删除设备
            remove(row){
                const current = judgeLastData(this.data,this.params.current);
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteEquip(row).then(res=>{
                    if(!res)return;
                    this.getList();
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .equipSelect{
        padding-right: 10px;
    }
</style>