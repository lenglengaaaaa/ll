<template>
    <div class="CREATE_EDIT">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="magicForm"
            :style="{maxHeight:'calc(100vh - 170px)'}"
        >
            <el-form-item label="资产名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="number">
                <el-input v-model="form.number" placeholder="请输入资产编号"></el-input>
            </el-form-item>

            <!-- 台区所需填写 -->
            <template v-if="type==0">
                <el-form-item label="台区类型">
                    <el-select v-model="form.courtsType">
                        <el-option label="开闭所变压器" value="0"></el-option>
                        <el-option label="柱上变压器" value="1"></el-option>
                        <el-option label="室内变压器" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变压前电压" prop="beforeVoltage">
                    <el-input v-model="form.beforeVoltage" placeholder="请输入变压前电压"></el-input>
                </el-form-item>
                <el-form-item label="变压后电压" prop="afterVoltage">
                    <el-input v-model="form.afterVoltage" placeholder="请输入变压后电压"></el-input>
                </el-form-item>
                <el-form-item label="电流等级" prop="electricityLevel">
                    <el-input v-model="form.electricityLevel" placeholder="请输入电流等级"></el-input>
                </el-form-item>
                <el-form-item label="电压等级" prop="covoltageLevel">
                    <el-input v-model="form.covoltageLevel" placeholder="请输入电压等级"></el-input>
                </el-form-item>
            </template>

            <!-- 配电房需选择所属台区 -->
            <template v-if="type==1">
                <el-form-item label="所属台区" prop="courtsId">
                    <el-select v-model="form.courtsId">
                        <el-option label="台区一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <!-- 配电柜需选择所属配电房 -->
            <template v-if="type==2">
                <el-form-item label="所属配电房" prop="roomId">
                    <el-select v-model="form.roomId">
                        <el-option label="配电房一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <!-- 除井盖及线缆外需选择主进线,备用进线可选可不选 -->
            <template v-if="type!=3&&type!=4">
                <el-form-item label="主进线" prop="mainComeline">
                    <el-select v-model="form.mainComeline">
                        <el-option label="线缆一" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备用进线">
                    <el-select v-model="form.comeLine">
                        <el-option label="备用线缆一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <!-- 线缆 -->
            <template v-if="type==4">
                <el-form-item label="是否为主线缆">
                    <el-select v-model="form.parentId">
                        <el-option label="是" value="0"></el-option>
                        <el-option label="否" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.parentId==1">
                    <el-form-item label="所属主线缆" prop="lineId">
                        <el-select v-model="form.lineId" >
                            <el-option label="主线缆一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属井盖" prop="trapId">
                        <el-select v-model="form.trapId" >
                            <el-option label="井盖一" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </template>

            <!--type为井盖时,所需填写字段-->
            <template v-if="type==3">
                <el-form-item label="所属主线缆" prop="lineId">
                    <el-select v-model="form.lineId" >
                        <el-option label="主线缆一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <el-form-item label="资产详情">
                <el-input v-model="form.detail" placeholder="请输入资产详情"></el-input>
            </el-form-item>

            <!--选择省市区,填写详细地址-->
            <el-form-item label="位置信息" prop="location" class="address">
                <el-cascader :options="options" v-model="form.city"></el-cascader>
                <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
            </el-form-item>

            <!--通过地图上点击,获取经纬度位置-->
            <el-form-item label="资产经纬度" class="map" v-if="type!=2&&type!=4">
                <MapSingle 
                    vid="newApply"
                    :position="form.position"
                    :get="getPostion"
                />
            </el-form-item>
            
            <el-form-item class="submit" v-if="!editFlag">
                <el-button type="primary" @click="submit" >
                    完成
                </el-button>
            </el-form-item>
            <el-form-item class="submit" v-else>
                <el-button type="primary" @click="edit" >
                    编辑完成
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'
    import {options} from '@/utils/options'

    const Name ={
        0:'CourtsList',
        1:'RoomList',
        2:'CabinetList',
        3:'CoverList',
        4:'NewCover'
    }

    export default {
        components: {
            MapSingle
        },
        data() {
            return {
                options:options,
                form: {
                    name:'',
                    number:'',
                    courtsType:'0',//台区类型
                    beforeVoltage:'',
                    afterVoltage:'',
                    electricityLevel:'',
                    covoltageLevel:'',
                    mainComeline:"",
                    comeLine:'',
                    courtsId:'',//台区ID
                    roomId:'',//配电房ID
                    detail:'',
                    city:[],
                    location:'',
                    position:[113.991244,22.5959],
                    
                    parentId:'0',
                    lineId:'',
                    trapId:'',
                },
                rules: {
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    mainComeline: [{ required: true, message: '请选择主进线', trigger: 'change' }],
                    courtsId: [{ required: true, message: '请选择所属台区', trigger: 'change' }],
                    roomId: [{ required: true, message: '请选择所属配电房', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择所属主线缆', trigger: 'change' }],
                    trapId: [{ required: true, message: '请选择所属井盖', trigger: 'change' }],
                }
            }
        },
        computed: {
            type() {
                return this.$store.state.app.assetType 
            },
            editFlag(){
                return this.$store.state.app.editObj.editFlag || false
            }
        },
        created () {
            const data = this.$store.state.app.editObj.data || {}; 
            this.form={
                ...this.form,
                ...data,
                position:[data.longitude,data.latitude],
            };
        },
        methods: {
            submit() {
                this.$refs.magicForm.validate((valid) => {
                    if (valid) {
                        this.$message({
                            message: '添加设备成功',
                            type: 'success'
                        });
                        
                        this.$router.push({name:Name[this.type]})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.form ={
                    ...this.form,
                    position:[lng,lat]
                }
            },
            edit(){
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.$router.push({name:Name[this.type]})
            }
        },
    }
</script>

<style lang="scss">
    @import '@/styles/form.scss';
    .CREATE_EDIT{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            max-height: calc(100vh - 170px);
        }
    }
</style>