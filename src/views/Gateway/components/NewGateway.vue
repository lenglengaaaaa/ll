<template>
    <div class="NewGateway_container">
        <div class="nav">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/gateway' }">我的网关</el-breadcrumb-item>
                <el-breadcrumb-item >{{editFlag?'编辑网关':'添加网关'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="body">
            <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="form">
                <el-form-item label="网关名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入网关名称"></el-input>
                </el-form-item>
                <el-form-item label="网关编号" >
                    <el-input v-model="form.number" placeholder="请输入字母,下划线或数字"></el-input>
                </el-form-item>
                <el-form-item label="卡号" >
                    <el-input v-model="form.card" placeholder="请输入卡号"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址" prop="mac">
                    <el-input v-model="form.mac" placeholder="0000000000000000" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="网关地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入网关地址"></el-input>
                </el-form-item>
                <el-form-item label="网关经纬度" class="map">
                    <Map 
                        vid="newGateway"
                        :position="form.position"
                        :get="getPostion"
                    ></Map>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submitForm" size="medium">
                        <i class="el-icon-circle-check"></i>
                        {{editFlag?'确认编辑':'确认添加'}}
                    </el-button>
                    <el-button type="danger" @click="goBack" size="medium">
                        <i class="el-icon-circle-close"></i>
                        返回
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Map from '@/components/MapSingle'

    export default {
        components: {
            Map
        },
        data() {
            return {
                editFlag:false,
                form: {
                    name: '',
                    number:'',
                    card: '',
                    mac: '',
                    address:'',
                    position:[113.991244,22.5959]
                },
                rules: {
                    name: [
                        { required: true, message: '请输入网关名称', trigger: 'blur' },
                    ],
                    mac: [
                        { required: true, message: '请输入MAC地址', trigger: 'blur' },
                        { min: 16, max: 16, message: 'MAC地址长度为16', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入网关地址', trigger: 'blur' },
                    ],
                }
            }
        },
        mounted () {
            const {editFlag,data} = this.$route.params;
            this.editFlag  = editFlag
            this.form ={
                ...this.form,
                ...data
            }
        },
        methods: {
            goBack(){
                this.$router.push('/gateway')
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$router.push('/gateway')
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            getPostion(lng,lat){
                this.form ={
                    ...this.form,
                    position:[lng,lat]
                }
                console.log(this.form,'form')
            }
        },
    }
</script>

<style lang="scss">
    .NewGateway_container{
        padding: 10px 20px;
        height: 100%;
        .nav{
            padding: 10px 0;
        }
        .body{
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .el-form{
                max-height: calc(100vh - 160px);
                overflow: scroll;
                width: 1140px;
                padding: 15px;
                background:#fff;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                .el-input__inner{
                    border-radius: 0px;
                    height: 35px;
                    line-height: 35px;
                }
                .map{
                    justify-self: flex-end;
                }
                .submit{
                    padding: 15px 0 10px 0;
                }
            }
        }
    }
</style>