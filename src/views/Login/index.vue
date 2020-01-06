<template>
    <div class="Login_container">
        <div class="header">
            <div class="icon">
                <img src="@images/logo.png" alt="logo">
            </div>
            <div class="title">
                智慧配电运维
            </div>  
        </div>
        <div class="body">
            <div class="bg">
                <img src="@images/login_bg.png" alt="loginbg">
            </div>
            <div class="login">
                <div class="login_title">
                    用户登录
                </div>
                <el-form 
                    label-width="0px" 
                    ref="loginForm" 
                    :model="loginForm"
                    :rules="loginRules"
                    auto-complete="on"
                >
                    <el-form-item prop="username">
                        <el-input 
                            name="username"
                            v-model="loginForm.username" 
                            placeholder="用户名"
                            prefix-icon="el-icon-s-custom"
                            auto-complete="on"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input 
                            name="password"
                            ref="password"
                            v-model="loginForm.password" 
                            placeholder="密码"
                            prefix-icon="el-icon-lock"
                            auto-complete="on"
                            :key="passwordType"
                            :type="passwordType"
                            @keyup.enter.native="handleLogin"
                        />
                        <span class="show-pwd" @click="showPwd">
                            <svg-icon 
                                :iconClass="passwordType === 'password' ? 'eyeclose' : 'eye'" 
                                className="icon"
                            />
                        </span>
                    </el-form-item>
                    <el-form-item size="large">
                        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="footer">
            <span>
                Copyright © 2019 中科(深圳)能源物联网有限公司 
            </span>
            <span>
                All Rights Reserved
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if(!value){
                    callback(new Error('请输入密码'))
                }
                // else if (value.length < 6) {
                //     callback(new Error('密码长度大于6位'))
                // }
                else {
                    callback()
                }
            }
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginRules: {
                    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
                },
                loading: false,
                passwordType: 'password'
            }
        },
        methods: {
            /**
             * 显示隐藏密码
             */
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            /**
             * 登录
             */
            handleLogin() {
                    this.$refs.loginForm.validate(valid => {
                        if (valid) {
                            this.loading = true
                            this.$store.dispatch('user/login', this.loginForm).then((res) => {
                                this.loading = false
                                if(!res) return;
                                this.$router.push({ path:'/' })
                            })
                        } else {
                            return false
                        }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 992px){
        .Login_container{
            .header{
                justify-content: center;
                padding-left: 0px !important;
            }
        }
    }
    @media screen and (max-width:1300px) {
        .Login_container{
            .body{
                justify-content: center;
                .bg{
                    display: none;
                }
            }
            .footer{
                flex-direction: column;
            }
        }   
    }
    .Login_container{
        height: 100vh;
        background: #eef1f2;
        .header{
            height: 75px;
            padding-left: 19.8vw;
            background: #ffffff;
            display: flex;
            align-items: center;
            .icon{
                display: flex;
                align-items: center;
                padding: 0px 20px;
                border-right: 2px solid #e1e1e1;
                img{
                    // width: 7rem;
                    widows: 128px;
                    height: 24px;
                }
            }
            .title{
                padding: 0px 20px;
                font-weight: 600;
                color: #43393a;
            }
        }
        .body{
            height: calc(100vh - 150px);
            overflow: hidden;
            @include around();
            .bg{
                // padding-left: 19.8vw;
                // padding-right: 7.2vw;
                img{
                    width: 30rem;
                    height: 382px;
                }
            }
            .login{
                width: 300px;
                height: 200px;
                padding:33px 40px;
                border: 10px solid #eaeef2;
                border-radius: 5px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
                .login_title{
                    color: #666666;
                    font-weight: 400;
                    font-size: 1.5rem;
                    text-align: center;
                    padding:10px 0 15px 0;
                }
                .el-button{
                    width: 100%;
                }
                .show-pwd {
                    position: absolute;
                    right: 10px;
                    top: 4px;
                    cursor: pointer;
                    user-select: none;
                    .icon{
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }   
        .footer{
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            span{
                font-size: 0.7rem;
                color: #464646;
            }
        }
    }
</style>