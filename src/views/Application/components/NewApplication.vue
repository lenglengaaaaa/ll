<template>
    <div class="NewApplication_container">
        <el-dialog
            :title="editFlag?'编辑应用':'添加应用'"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            @close="handleClose"
        >
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
                <el-form-item label="应用ID" prop="id">
                    <el-input v-model="form.id" placeholder="请输入应用ID"></el-input>
                </el-form-item>
                <el-form-item label="应用名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
                </el-form-item>
                <el-form-item label="应用描述">
                    <el-input v-model="form.description" placeholder="请输入应用描述"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" prop="type">
                    <el-select v-model="form.type" placeholder="请选择应用类型" :disabled="editFlag?true:false">
                        <el-option label="低压应用" value="0"></el-option>
                        <el-option label="魔节应用" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm" size="small">
                        <i class="el-icon-check"></i>
                        {{editFlag?'确认编辑':'确认添加'}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    const resetForm = {
        id: '',
        name:'',
        description: '',
        type:''
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
                dialogVisible: false,
                editFlag:false,
                form: {
                    id: '',
                    name:'',
                    description: '',
                    type:''
                },
                rules: {
                    id: [
                        { required: true, message: '请输入应用ID', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择应用类型', trigger: 'blur' }
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
                    .el-select{
                        width: 100%;
                    }
                }
                .el-button--small{
                    width: 100%;
                }
            }
        }
    }
</style>