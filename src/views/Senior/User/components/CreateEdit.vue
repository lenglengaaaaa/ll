<template>
    <Dialog
        title="用户"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="userForm">
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入用户账号" :disabled="editFlag"></el-input>
            </el-form-item>
            <template v-if="!editFlag">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入用户密码" ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input v-model="form.checkPass" type="password" placeholder="确认密码" ></el-input>
                </el-form-item>
            </template>
            <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" type="tel"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="详情">
                <el-input v-model="form.details" placeholder="请输入用户详情"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'编辑完成':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog'

    const restForm ={
        name:'',
        userName: '',
        password:"",
        checkPass:'',
        phoneNumber:'',
        email:'',
        details:''
    }

    export default {
        components: {
            Dialog,
        },
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
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.userForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            const checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const checkPhone = (rule,value,callback) =>{
                const myreg=/^[1][34578][0-9]{9}$/;  
                if (!myreg.test(value)) {  
                    callback(new Error('请输入正确的手机号码'));
                }
                callback();
            }
            const checkEmail = (rule,value,callback) =>{
                const myreg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  
                if (!myreg.test(value)) {  
                    callback(new Error('请输入正确的邮箱'));
                }
                callback();
            }
            return {
                form: {
                    name:'',
                    userName: '',
                    password:"",
                    checkPass:'',
                    phoneNumber:'',
                    email:'',
                    details:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    userName: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { required: true, validator: checkPass, trigger: 'blur' }
                    ],
                    phoneNumber: [
                        {  validator: checkPhone, trigger: 'blur' }
                    ],
                    email: [
                        {  validator: checkEmail, trigger: 'blur' }
                    ],
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
            handleClose() {
                this.form = restForm
                this.close();
            },
            submitForm() {
                this.$refs.userForm.validate((valid) => {
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

</style>