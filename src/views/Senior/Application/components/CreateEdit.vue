<template>
    <cc-dialog
        title="应用"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="applyForm">
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="应用名称" prop="appName">
                        <el-input v-model="form.appName" placeholder="请输入应用名称"></el-input>
                    </el-form-item>
                    <el-form-item label="应用密钥" prop="appKey">
                        <el-input v-model="form.appKey" placeholder="请输入应用密钥"></el-input>
                    </el-form-item>
                    <el-form-item label="应用类型" prop="appType">
                        <el-input v-model="form.appType" placeholder="请输入应用类型"></el-input>
                    </el-form-item>
                    <el-form-item label="入网模式" prop="netModel">
                        <el-input v-model="form.netModel" placeholder="请输入入网模式"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="form.appDetail" placeholder="请输入应用描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="coap链接方式" prop="coapWay">
                        <el-input v-model="form.coapWay" placeholder="请输入coap链接方式"></el-input>
                    </el-form-item>
                    <el-form-item label="mqtt链接方式" prop="mqttWay">
                        <el-input v-model="form.mqttWay" placeholder="请输入mqtt链接方式"></el-input>
                    </el-form-item>
                    <el-form-item label="AgentLite链接方式" prop="agentliteWay">
                        <el-input v-model="form.agentliteWay" placeholder="请输入AgentLite链接方式"></el-input>
                    </el-form-item>
                    <el-form-item label="https链接方式" prop="httpsWay">
                        <el-input v-model="form.httpsWay" placeholder="请输入https链接方式"></el-input>
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
    const restForm ={
        appName:'',
        appKey:'',
        appType:'',
        netModel:'',
        coapWay:'',
        mqttWay:'',
        agentliteWay:'',
        httpsWay:'',
        appDetail:''
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
            return {
                form: {
                    appName:'',
                    appKey:'',
                    appType:'',
                    netModel:'',
                    coapWay:'',
                    mqttWay:'',
                    agentliteWay:'',
                    httpsWay:'',
                    appDetail:''
                },
                rules: {
                    appName: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' },
                    ],
                    appKey: [
                        { required: true, message: '请输入应用密钥', trigger: 'blur' }
                    ],
                    appType: [
                        { required: true, message: '请输入应用类型', trigger: 'blur' }
                    ],
                    netModel: [
                        { required: true, message: '请输入入网模式', trigger: 'blur' }
                    ],
                    coapWay: [
                        { required: true, message: '请输入coap链接方式', trigger: 'blur' }
                    ],
                    mqttWay: [
                        { required: true, message: '请输入mqtt链接方式', trigger: 'blur' }
                    ],
                    agentliteWay: [
                        { required: true, message: '请输入AgentLite链接方式', trigger: 'blur' }
                    ],
                    httpsWay: [
                        { required: true, message: '请输入https链接方式', trigger: 'blur' }
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
                this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    this.handleClose()
                } else {
                    return false;
                }
                });
            },
        },
    }
</script>

<style lang="scss">
    .create_edit{
        .el-dialog{
            margin-top:3vh !important; 
        }
    }
</style>