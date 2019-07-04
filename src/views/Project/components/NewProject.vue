<template>
    <Dialog
        title="项目"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="form.projectName" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="项目描述">
                <el-input v-model="form.projectDetail" placeholder="请输入应用描述"></el-input>
            </el-form-item>
            <el-form-item label="项目所属位置" prop="areaId">
                <el-cascader :options="options" v-model="form.areaId"  placeholder="请选择项目所属位置"></el-cascader>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'确认编辑':'确认添加'}}
                </el-button>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog'
    import {options} from '@/utils/options'
    
    const resetForm = {
        projectName:'',
        projectDetail: '',
        areaId:[]
    }
    export default {
        components: {
            Dialog
        },
        props: {
            visible:Boolean,
            value:{
                type:Object,
                default:()=>{}
            },
            close:Function
        },
        data() {
            return {
                options:options,
                editFlag:false,
                form: {
                    projectName:'',
                    projectDetail: '',
                    areaId:[]
                },
                rules: {
                    projectName: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    areaId: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                }
            }
        },
        watch: {
            value(newValue, oldValue) {
                const {editFlag,data} = newValue
                this.editFlag = editFlag;
                this.form = {
                    ...this.form,
                    ...data
                }
            },
        },
        methods: {
            handleClose() {
                this.form =resetForm;
                this.editFlag = false;
                this.close();
            },
            submitForm() {
                this.$refs.appForm.validate((valid) => {
                if (valid) {
                    console.log(this.form,'form')
                    this.handleClose()
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .create_edit{
        .el-dialog{
            width: 450px;
        }
    }
</style>