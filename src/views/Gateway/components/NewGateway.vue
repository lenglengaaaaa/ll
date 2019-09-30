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
                <el-form-item label="网关编号" prop="number">
                    <el-input v-model="form.number" placeholder="请输入字母,下划线或数字"></el-input>
                </el-form-item>
                <el-form-item label="卡号" prop="card">
                    <el-input v-model="form.card" placeholder="请输入卡号" ></el-input>
                </el-form-item>
                <el-form-item label="MAC地址" prop="mac">
                    <el-input v-model="form.mac" placeholder="请输入网关MAC地址" maxlength="16" :disabled="editFlag"></el-input>
                </el-form-item>
                <el-form-item label="网关详情">
                    <el-input v-model="form.detail" placeholder="请输入网关详情"></el-input>
                </el-form-item>
                <el-form-item label="位置信息" prop="location" class="address">
                    <el-cascader 
                        :options="options" 
                        v-model="form.city"  
                        placeholder="省/市/区"
                        :props="{
                            children:'childList',
                            value:'name',
                            label:'name'
                        }"
                    />
                    <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
                </el-form-item>
                <el-form-item label="网关经纬度" class="map">
                    <cc-mapSingle 
                        vid="newGateway"
                        :position="position"
                        :get="getPostion"
                    />
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
    import { mapActions } from 'vuex';

    export default {
        data() {
            const checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入网关名称'));
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母!'))
                }
                callback();
            };
            const checkMac = (rule, value, callback) => {
                if(this.editFlag) return callback();
                if (!value) {
                    return callback(new Error('请输入MAC地址'));
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母!'))
                }
                if (value.length<16) {
                    return callback(new Error(`MAC地址长度为16`));
                }
                const obj ={value,type:0}
                this.$store.dispatch('overall/checkMacOrCard', obj).then(res=>{
                    if(!res){
                        return callback(new Error('MAC已存在'));
                    }else{
                        callback()
                    }
                });
            };
            const checkCard = (rule, value, callback) => {
                if(this.editFlag) return callback();
                if (!value) {
                    return callback(new Error('请输入卡号'));
                }
                const obj ={value,type:1}
                this.$store.dispatch('overall/checkMacOrCard', obj).then(res=>{
                    if(!res){
                        return callback(new Error('Card已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                options:[],
                position:[],
                editFlag:false,
                form: {},
                rules: {
                    name: [{ required: true, validator: checkName, trigger: 'blur' }],
                    number: [{ required: true, message: '请输入网关资产编号', trigger: 'blur' }],
                    card: [ { required: true, validator: checkCard, trigger: 'blur' }],
                    mac: [{ required: true, validator: checkMac, trigger: 'blur' }],
                }
            }
        },
        mounted () {
            const areaTree = JSON.parse(sessionStorage.getItem('areaTree'));
            this.options = areaTree
        },
        created () {
            const {data,editFlag} = JSON.parse(sessionStorage.getItem('assetObj'));
            this.form={
                ...this.form,
                ...data
            };
            this.position = [data.longitude||113.991244,data.latitude||22.5959];
            this.editFlag=editFlag;
        },
        methods: {
            ...mapActions('overall',[
                'createGateway',
                'updateGateway'
            ]),
            goBack(){
                this.$router.push('/gateway')
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const location = `${this.form.city.join(',')},${this.form.location}`
                        const data ={
                            ...this.form,
                            location,
                            longitude:this.position[0],
                            latitude:this.position[1]
                        }
                        if(!this.editFlag){
                            this.createGateway(data).then(res=>{
                                if(!res)return;
                                this.goBack();
                            })
                                
                        }else{
                            this.updateGateway(data).then(res=>{
                                if(!res)return;
                                this.goBack();
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.position =[lng,lat];
            }
        },
    }
</script>

<style lang="scss">
    .NewGateway_container{
        padding: 10px 20px;
        height: calc(100% - 20px);
        .nav{
            padding: 10px 0;
        }
        .body{
            margin-top: 10px;
            overflow: scroll;
            height: calc(100% - 44px);
            .el-form{
                margin: 0px auto;
                width: 1140px;
                padding: 15px;
                margin-bottom: 5px;
                background:#fff;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                .el-input__inner{
                    border-radius: 0px;
                    height: 35px;
                    line-height: 35px;
                }
                .address{
                    .el-form-item__content{
                        display: flex;
                        .el-cascader{
                            width: 300px;
                            padding-right: 10px;
                        }
                    }
                }
                .map{
                    justify-self: flex-end;
                }
                .submit{
                    text-align: center;
                    padding: 15px 0 10px 0;
                }
            }
        }
    }
</style>