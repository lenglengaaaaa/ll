<template>
    <div>
        <cc-table
            title="设备"
            :getList="getList"
            :skipTo="skipTo"
            :remove="remove"
            :isDevice="true"
            :verify="false"
            hasUpload
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
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="所属台区">
                                        <span>{{ props.row.courtsName || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="所属配电房">
                                        <span>{{ props.row.roomName || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="所属配电柜">
                                        <span>{{ props.row.chestName || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="所属井盖">
                                        <span>{{ props.row.trapName || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="所属线缆">
                                        <span>{{ props.row.lineName || '---' }}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="所属魔节">
                                        <span>{{ (props.row.parentType == 30 && props.row.parentName) || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="所属集中器">
                                        <span>{{ (props.row.parentType == 33 && props.row.parentName) || '---' }}</span>
                                    </el-form-item>
                                    <el-form-item label="创建时间">
                                        <span>{{ calFromNow(props.row.createTime) }}</span>
                                    </el-form-item>
                                    <el-form-item label="安装位置">
                                        <span>{{ props.row.location || '---' }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeName"
                    label="设备类型"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="name"
                    label="设备名称"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-link 
                            type="primary" 
                            @click="skipToDetail(scope.row)" 
                            :underline="false"
                        >
                            {{scope.row.name}}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="设备EUI"
                    align="center"
                    show-overflow-tooltip
                    :formatter="(row)=>row.deviceEui || '-'"
                />
                <el-table-column
                    prop="deviceAdress"
                    label="设备地址域(设备ID)"
                    align="center"
                    width="155"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="number"
                    label="设备编号"
                    align="center"
                    show-overflow-tooltip
                />
            </template>
        </cc-table>
        <UploadDialog 
            :visible="dialogVisible"
            :close="closeDialog"
            :isUploaded="isUploaded"
        />
        <OtherFucDialog 
            :visible="otherVisible"
            :close="closeDialog"
        />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import UploadDialog from '../components/UploadDialog'
    import OtherFucDialog from '../components/OtherFucDialog'


    export default {
        components: {
            UploadDialog,
            OtherFucDialog
        },
        data() {
            return {
                value:null,
                dialogVisible: false,
                otherVisible: false,
                params:{
                    deviceType:null,
                    size:20,    
                    current:1 ,   
                    projectId:JSON.parse(sessionStorage.getItem('project')).id
                }
            }
        },
        mounted () {
            const { deviceType } = this.pageParams.data;
            deviceType && (this.value = deviceType);
        },
        computed: {
            ...mapState('equip',[
                'equipTypeMenu',
            ]),
            types(){

                // V2.0取消"全部设备"选项.
                return [
                    {
                        "id": null,
                        "value": "全部设备",
                    },
                    ...this.equipTypeMenu
                ]
            },
            pageParams(){
                return JSON.parse(sessionStorage.getItem("pageParams"));
            }
        },
        methods: {
            ...mapActions('equip',[
                'getEquipList',
                'deleteEquip'
            ]),
            //获取设备列表
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getEquipList(data).then(res=>{
                    if(!res) return;
                    return res;
                })
            },
            //切换设备
            changeEquip(deviceType){
                const data ={
                    ...this.params,
                    deviceType,
                    current:1
                }

                sessionStorage.setItem("pageParams",JSON.stringify({...this.pageParams, data}));

                // if(!deviceType) delete data.deviceType;
                this.params = data;
                this.$children[0]&&this.$children[0].getListData(data);
            },
            skipTo(type,row) {
                this.$store.dispatch('asset/skipToEdit',{
                    type,
                    row,
                    storage:'equipObj',
                })
                switch (type) {
                    case 'otherFuc':
                        this.otherVisible= true;
                        return;
                    case 'upload':
                        this.dialogVisible= true;
                        return;
                    case 'set':
                        this.$router.push({name:'DeviceThSet'});
                        return;
                    default:
                        this.$router.push({name:'NewEqu'});
                }
            },
            skipToDetail(row){
                sessionStorage.setItem('equipObj',JSON.stringify(row))
                this.$router.push({name:'EquDetail',params:{equipId:row.id}})
            },
            //删除设备
            remove(row,current){
                this.params ={
                    ...this.params,
                    current
                }
                this.deleteEquip(row).then(res=>{
                    if(!res)return;
                    this.$children[0]&&this.$children[0].getListData()
                });
            },
            //时间转换
            calFromNow(time){
                return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
            },
            //关闭上传模态窗
            closeDialog(){
                this.dialogVisible = false;
                this.otherVisible = false;
            },
            //上传成功后获取最新列表
            isUploaded(){
                this.params ={
                    ...this.params,
                    current:1
                };
                this.$children[0]&&this.$children[0].getListData();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .equipSelect{
        padding-right: 10px;
    }
    .el-link.el-link--primary{
        &:hover{
            color:#67c23a;
        }
    }
</style>