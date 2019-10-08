<template>
    <cc-dialog
        title="用户"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="userForm">
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model="form.userName" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="账号" prop="name">
                        <el-input v-model="form.name" placeholder="请输入用户账号" :disabled="editFlag"></el-input>
                    </el-form-item>
                </el-col>
                <template v-if="!editFlag">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" type="password" placeholder="请输入用户密码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input v-model="form.checkPass" type="password" placeholder="确认密码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="操作密码 (用于功能操作验证,长度为6)" prop="operationPwd">
                            <el-input 
                                v-model.number="form.operationPwd" 
                                type="password" 
                                placeholder="请输入操作密码" 
                                :maxlength="6"
                            />
                        </el-form-item>
                    </el-col>
                </template>
                <el-col :span="12" :xs="24">
                    <el-form-item label="手机号码" prop="phoneNum">
                        <el-input v-model.number="form.phoneNum" placeholder="请输入手机号码" maxlength="11" type="tel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="详情">
                        <el-input v-model="form.description" placeholder="请输入用户详情"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'编辑完成':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </cc-dialog>
</template>

<script>
    import { mapActions } from 'vuex';

    const restForm ={
        userName:'',
        name: '',
        password:"",
        checkPass:'',
        operationPwd:'',
        phoneNum:'',
        email:'',
        description:''
    }

    export default {
        props: {
            visible:Boolean,
            editFlag:Boolean,
            close:Function,
            value:{
                type:Object,
                default:()=>{}
            }
        },
        data() {
            const checkAccount = (rule, value, callback) => {
                if(this.editFlag) return callback();
                if (!value) {
                    return callback(new Error('请输入用户账号'));
                }
                this.$store.dispatch('user/checkAccout', value).then(res=>{
                    if(!res){
                        return callback(new Error('用户名已存在'));
                    }else{
                        callback()
                    }
                });
            };
            const validatePass = (rule, value, callback) => {
                if (!value) { callback(new Error('请输入密码')) } 
                if (this.form.checkPass) { this.$refs.userForm.validateField('checkPass') };
                callback();
            };
            const checkPass = (rule, value, callback) => {
                if (!value) { callback(new Error('请再次输入密码')) }
                if (value !== this.form.password) { callback(new Error('两次输入密码不一致!')) }
                callback();
            };
            const operatePass =(rule,value,callback)=>{
                const myreg=/^[1-9]+[0-9]*]*$/;
                if (!value) { callback(new Error('请输入操作密码'))};
                if ( `${value}`.length !== 6 ) { callback(new Error('操作密码长度为6!')) };
                callback();
            }
            const checkPhone = (rule,value,callback) =>{
                if(!`${value}`.length) callback();
                const myreg=/^[1][34578][0-9]{9}$/;  
                if (!myreg.test(value)) { callback(new Error('请输入正确的手机号码')) };
                callback();
            }
            const checkEmail = (rule,value,callback) =>{
                if(!`${value}`.length) callback();
                const myreg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  
                if (!myreg.test(value)) { callback(new Error('请输入正确的邮箱')) };
                callback();
            }
            return {
                form: {},
                rules: {
                    userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' },],
                    name: [{ required: true, validator: checkAccount, trigger: 'blur' }],
                    password: [{ required: true, validator: validatePass, trigger: 'blur' }],
                    checkPass: [{ required: true, validator: checkPass, trigger: 'blur' }],
                    operationPwd: [{ required: true, validator: operatePass, trigger: 'blur' }],
                    phoneNum: [{ validator: checkPhone, trigger: 'blur' }],
                    email: [{  validator: checkEmail, trigger: 'blur' }]
                }
            }
        },
        watch: {
            value(value) {
                this.form = {
                    ...this.form,
                    ...value
                }
            },
        },
        methods: {
            ...mapActions('user',[
                'createAccount',
                'updateAccount'
            ]),
            handleClose(result=false) {
                this.form = restForm;
                this.close(result);
            },
            submitForm() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        if(!this.editFlag){
                            this.createAccount(this.form).then(res=>{
                                if(!res)return;
                                this.handleClose(res)
                            })
                            return
                        }
                        this.updateAccount(this.form).then(res=>{
                            if(!res)return;
                            this.handleClose(res)
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>

<style lang="scss">

</style>