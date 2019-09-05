<template>
    <div class="change_pass">
        <el-form 
            label-position="top" 
            :model="ruleForm" 
            status-icon 
            :rules="rules" 
            ref="ruleForm" 
        >
            <h4>修改用户密码</h4>
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
        <el-form 
            label-position="top" 
            :model="ruleForm" 
            status-icon :rules="rules" 
            ref="operateForm" 
        >
            <h4>修改操作密码</h4>
            <el-form-item label="用户密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="操作密码" prop="operationPwd">
                <el-input type="password" v-model="ruleForm.operationPwd" autocomplete="off" maxlength="6"></el-input>
            </el-form-item>
            <el-form-item label="确认操作密码" prop="checkOperationPwd">
                <el-input type="password" v-model="ruleForm.checkOperationPwd" autocomplete="off" maxlength="6"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('operateForm')">提交</el-button>
                <el-button @click="resetForm('operateForm')">重置</el-button>
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
            const operatePass =(rule,value,callback)=>{
                const myreg=/^[1-9]+[0-9]*]*$/;
                if (value === '') {
                    callback(new Error('请输入操作密码'));
                } else if (value&&value.length !== 6) {
                    callback(new Error('操作密码长度为6!'));
                } else if(!myreg.test(value)){
                    callback(new Error('请输入正整数'));
                }else{
                    callback();
                }
            }
            const checkOperationPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.operationPwd) {
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
                    pass:'',
                    operationPwd:'',
                    checkOperationPwd:''
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
                    ],
                    pass: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                    ],
                    operationPwd: [
                        {required: true,validator: operatePass, trigger: 'blur' }
                    ],
                    checkOperationPwd: [
                        {required: true, validator: checkOperationPwd, trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('userDetail')).id; 
            }
        },
        methods: {
            ...mapActions('user',[
                'updatePass', 
                'updateOperatePass'
            ]),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName==="ruleForm"){
                            this.updatePass({
                                id:this.userId,
                                ...this.ruleForm
                            }).then(res=>{
                                if(!res)return;
                                this.$refs[formName].resetFields();
                            })
                        }else{
                            this.updateOperatePass({
                                id:this.userId,
                                password:this.ruleForm.pass,
                                operationPwd:this.ruleForm.checkOperationPwd
                            }).then(res=>{
                                if(!res)return;
                                this.$refs[formName].resetFields();
                            })
                        }
                        
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
    @media screen and (max-width: 870px) {
        .change_pass{
            flex-direction: column;
        }
    }

    .change_pass{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-form{
            width:500px;
            max-width: 100%;
            padding: 15px 10px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            margin: 20px;
            h4{
                margin: 5px 0 15px 0 ;
            }
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