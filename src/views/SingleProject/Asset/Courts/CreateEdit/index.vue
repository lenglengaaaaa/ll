<template>
    <CreateEdit
        :form="form"
        :rules="rules"
        :create="create"
        :edit="edit"
    >
        <template>
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
    </CreateEdit>
</template>

<script>
    import CreateEdit from '@/components/CreateEdit'

    export default {
        components: {
            CreateEdit,
        },
        data() {
            return {
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
                    detail:'',
                    city:[],
                    location:'',
                    position:[],
                },
                rules: {
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    mainComeline: [{ required: true, message: '请选择主进线', trigger: 'change' }],
                }
            }
        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            this.form={
                ...this.form,
                ...data,
                position:[data.longitude||113.991244,data.latitude||22.5959],
            };
        },
        methods: {
            create() {
                console.log('创建台区')
            },
            edit(){
                console.log('编辑台区')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>