<template>
    <div class="change_pass">
        <el-form 
            label-position="top" 
            :model="ruleForm" 
            status-icon :rules="rules" 
            ref="ruleForm" 
        >
            <el-form-item label="原密码" prop="oldPassword">
                <el-input  type="password" v-model="ruleForm.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="firstNewPassword">
                <el-input type="password" v-model="ruleForm.firstNewPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="againNewPassword">
                <el-input type="password" v-model="ruleForm.againNewPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            const pass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.againNewPassword !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            const checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.firstNewPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    oldPassword:'',
                    firstNewPassword: '',
                    againNewPassword: '',
                },
                rules: {
                    oldPassword: [
                        { required: true, message: '请输入当前密码', trigger: 'blur' },
                    ],
                    firstNewPassword: [
                        {required: true,validator: pass, trigger: 'blur' }
                    ],
                    againNewPassword: [
                        {required: true, validator: checkPass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            ...mapActions('user',[
                'updatePass', 
            ]),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const {id} = JSON.parse(sessionStorage.getItem('userDetail'));
                        this.updatePass({
                            id,
                            ...this.ruleForm
                        })
                    } else {
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