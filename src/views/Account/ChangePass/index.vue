<template>
    <div class="change_pass">
        <el-form 
            label-position="top" 
            :model="ruleForm" 
            status-icon :rules="rules" 
            ref="ruleForm" 
        >
            <el-form-item label="原密码" prop="oldPass">
                <el-input  type="password" v-model="ruleForm.oldPass"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            const pass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            const checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    oldPass:'',
                    pass: '',
                    checkPass: '',
                },
                rules: {
                    oldPass: [
                        { required: true, message: '请输入当前密码', trigger: 'blur' },
                    ],
                    pass: [
                        {required: true,validator: pass, trigger: 'blur' }
                    ],
                    checkPass: [
                        {required: true, validator: checkPass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .change_pass{
        padding-top: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            width:400px;
            max-width: 100%;
            padding: 15px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-input__inner{
                border-radius: 0px;
                height: 35px;
                line-height: 35px;
            }
            .submit{
                padding-top: 20px;
                text-align: center;
            }
        }
    }
</style>