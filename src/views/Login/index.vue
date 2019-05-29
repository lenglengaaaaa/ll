<template>
    <div class="Login_container">
        <div class="header">
            <div class="icon">
                <img src="../../assets/img/logo.png" alt="logo">
            </div>
            <div class="title">
                智慧配电运维
            </div>  
        </div>
        <div class="body">
            <div class="bg">
                <img src="../../assets/img/login_bg.jpg" alt="loginbg">
            </div>
            <div class="login">
                <div class="login_title">
                    用户登录
                </div>
                <el-form label-width="0px" :model="formLabelAlign">
                    <el-form-item>
                        <el-input 
                            v-model="formLabelAlign.username" 
                            placeholder="用户名"
                            prefix-icon="el-icon-s-custom"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input 
                            type="password"
                            v-model="formLabelAlign.password" 
                            placeholder="密码"
                            prefix-icon="el-icon-lock"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item size="large">
                        <el-button type="primary" @click="onSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="footer">
            <span>
                Copyright © 2019 中科(深圳)能源物联网有限公司 All Rights Reserved
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                labelPosition: 'right',
                formLabelAlign: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width:1300px) {
        .body{
            justify-content: center;
            .bg{
                display: none;
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
                    width: 5.225rem;
                }
            }
            .title{
                padding: 0px 20px;
                font-weight: 600;
                font-size: 0.77rem;
                color: #43393a;
            }
        }
        .body{
            height: calc(100vh - 150px);
            display: flex;
            align-items: center;
            .bg{
                padding-left: 19.8vw;
                padding-right: 7.2vw;
                img{
                    width: 25rem;
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
                .login_title{
                    color: #666666;
                    font-weight: 400;
                    font-size: 24px;
                    text-align: center;
                    padding:10px 0 15px 0;
                }
                .el-button{
                    width: 100%;
                }
            }
        }   
        .footer{
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            span{
                font-size: 0.5rem;
                color: #464646;
            }
        }
    }
</style>