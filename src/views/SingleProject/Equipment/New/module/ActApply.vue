<template>
    <div class="activate_wrap">
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="actForm">
            <el-form-item label="设备地址" prop="devAddr">
                <el-link type="primary" class="random" @click="random" :underline="false">(随机生成)</el-link>
                <el-input v-model="form.devAddr" placeholder="00000000"></el-input>
            </el-form-item>
            <el-form-item label="网络密钥" prop="nwkSKey">
                <el-link type="primary" class="random" @click="getRandomSkey('nwkSKey')" :underline="false">(随机生成)</el-link>
                <el-input v-model="form.nwkSKey" placeholder="请输入网络密钥"></el-input>
            </el-form-item>
            <el-form-item label="应用密钥" prop="appSKey">
                <el-link type="primary" class="random" @click="getRandomSkey('appSKey')" :underline="false">(随机生成)</el-link>
                <el-input v-model="form.appSKey" placeholder="请输入应用密钥"/>
            </el-form-item>
            <el-form-item label="上行帧数" prop="fCntUp">
                <el-input v-model.number="form.fCntUp" placeholder="0"></el-input>
            </el-form-item>
            <el-form-item label="下行帧数" prop="fCntDown">
                <el-input v-model.number="form.fCntDown" placeholder="0"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submit" >
                    完成
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        props: {
            next: Function
        },
        data() {
            return {
                form: {
                    devAddr:null,
                    nwkSKey:null,
                    appSKey:null,
                    fCntUp:null,
                    fCntDown:null
                },
                rules: {
                    devAddr: [
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
        computed: {
            deviceEui() {
                const {deviceEui} = JSON.parse(sessionStorage.getItem('equipObj')).data;
                return deviceEui;
            }
        },
        methods: {
            ...mapActions('equip',[
                'getRandomEui',
                'activateDevice'
            ]),
            random(){
                this.getRandomEui(this.deviceEui).then(res=>{
                    if(!res)return;
                    this.form.devAddr = res;
                })
            },
            //随机生成网络密钥&应用密钥
            getRandomSkey(name){
                const chars = "0123456789abcdef";
                const maxPos = chars.length;
                var skey = '';
                for (var i = 0; i < 32; i++) {
                    skey += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                this.form[name] = skey;
            },
            submit() {
                this.$refs.actForm.validate((valid) => {
                    if (valid) {
                        this.activateDevice({
                            ...this.form,
                            devEUI:this.deviceEui
                        }).then(res=>{
                            if(!res)return;
                            this.$router.push({name:'EquList'});
                        })
                    } else {
                        this.$message({
                            message: '请正确填写表单信息!',
                            type: 'warning'
                        });
                        return false;
                        return false;
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .activate_wrap{
        display: flex;
        justify-content: center;
        max-width: 100%;
        .el-form{
            width:800px;
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
    }
</style>