<template>
    <div class="NewApplication_container">
        <el-dialog
            :title="editFlag?'编辑项目':'添加项目'"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            @close="handleClose"
        >
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
                </el-form-item>
                <el-form-item label="项目描述">
                    <el-input v-model="form.description" placeholder="请输入应用描述"></el-input>
                </el-form-item>
                <el-form-item label="项目所属位置" prop="address">
                    <el-cascader :options="options" v-model="form.address"  placeholder="请选择项目所属位置"></el-cascader>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm" >
                        <i class="el-icon-check"></i>
                        {{editFlag?'确认编辑':'确认添加'}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {options} from '@/utils/options'

    const resetForm = {
        name:'',
        description: '',
        address:[]
    }

    export default {
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
                dialogVisible: false,
                editFlag:false,
                form: {
                    name:'',
                    description: '',
                    address:[]
                },
                rules: {
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    address: [
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
            visible(newValue, oldValue) {
                this.dialogVisible = newValue
            }
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

<style lang="scss">
    .NewApplication_container{
        .el-dialog{
            width: 450px;
            max-width: 90%;
            .el-dialog__header{
                padding: 12px 20px;
                display: flex;
                align-items: center;
                background-color: #eee;
                .el-dialog__title{
                    color: #869198;
                    font-size: 16px;
                }
            }
            .el-dialog__body{
                .el-form{
                    .el-input__inner{
                        border-radius: 0px;
                        height: 35px;
                        line-height: 35px;
                    }
                    .el-select,.el-cascader{
                        width: 100%;
                    }
                }
                .submit{
                    // width: 100%;
                    padding-top: 20px;
                    text-align: center;
                }
            }
        }
    }
</style>