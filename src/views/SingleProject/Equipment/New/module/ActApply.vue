<template>
    <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="actForm">
        <el-form-item label="设备地址" prop="address">
            <el-link type="primary" class="random" @click="random">(随机生成)</el-link>
            <el-input v-model="form.address" placeholder="00000000"></el-input>
        </el-form-item>
        <el-form-item label="网络密钥" prop="nwkSKey">
            <el-link type="primary" class="random" @click="random">(随机生成)</el-link>
            <el-input v-model="form.nwkSKey" placeholder="请输入网络密钥"></el-input>
        </el-form-item>
        <el-form-item label="应用密钥" prop="appSKey">
            <el-link type="primary" class="random" @click="random">(随机生成)</el-link>
            <el-input v-model="form.appSKey" placeholder="请输入应用密钥"/>
        </el-form-item>
        <el-form-item label="上行帧数" prop="fCntUp">
            <el-input v-model="form.fCntUp" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="下行帧数" prop="fCntDown">
            <el-input v-model="form.fCntDown" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item class="submit">
            <el-button type="primary" @click="submit" >
                完成
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        props: {
            next: Function
        },
        data() {
            return {
                form: {
                    address:'',
                    nwkSKey:'',
                    appSKey:'',
                    fCntUp:'',
                    fCntDown:''
                },
                rules: {
                    address: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' },
                    ],
                    nwkSKey: [
                        { required: true, message: '请输入网络密钥', trigger: 'blur' },
                    ],
                    appSKey: [
                        { required: true, message: '请输入应用密钥', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            random(){
                console.log('随机获取')
            },
            submit() {
                this.$refs.actForm.validate((valid) => {
                    if (valid) {
                        this.next()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .el-form{
        width:500px;
        padding: 15px;
        background:#fff;
        box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
        margin-bottom: 5px;
        .el-input__inner{
            border-radius: 0px;
            height: 35px;
            line-height: 35px;
        }
        .el-select{
            width: 100%;
        }
        .el-form-item {
            position: relative;
            .random{
                position: absolute;
                top: -40px;
                left: 75px;
            }
        }
        .submit{
            padding-top: 20px;
            text-align: center;
        }
    }
</style>