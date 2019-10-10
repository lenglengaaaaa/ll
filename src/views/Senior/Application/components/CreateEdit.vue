<template>
    <cc-dialog
        title="应用"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="应用ID" prop="appId">
                        <el-input v-model="form.appId" placeholder="请输入应用ID" :disabled="editFlag"></el-input>
                    </el-form-item>
                    <el-form-item label="应用名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
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
                    <el-form-item label="描述" prop="detail">
                        <el-input v-model="form.detail" placeholder="请输入应用描述"></el-input>
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
        appId:'',
        name:'',
        appKey:'',
        appType:'',
        netModel:'',
        coapWay:'',
        mqttWay:'',
        agentliteWay:'',
        httpsWay:'',
        detail:''
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
                form: {},
                rules: {
                    appId: [{ required: true, message: '请输入应用ID', trigger: 'blur' },],
                    name: [{ required: true, message: '请输入应用名称', trigger: 'blur' },],
                    appKey: [{ required: true, message: '请输入应用密钥', trigger: 'blur' }],
                    appType: [{ required: true, message: '请输入应用类型', trigger: 'blur' }],
                    netModel: [{ required: true, message: '请输入入网模式', trigger: 'blur' }],
                    coapWay: [{ required: true, message: '请输入coap链接方式', trigger: 'blur' }],
                    mqttWay: [{ required: true, message: '请输入mqtt链接方式', trigger: 'blur' }],
                    agentliteWay: [{ required: true, message: '请输入AgentLite链接方式', trigger: 'blur' }],
                    httpsWay: [{ required: true, message: '请输入https链接方式', trigger: 'blur' }],
                    detail: [{ required: true, message: '请输入应用描述', trigger: 'blur' }],
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
            ...mapActions('senior',[
                'createApp', 
                'updateApp'
            ]),
            handleClose(result=false) {
                this.form = restForm ;
                this.close(result) ;
            },
            submitForm() {
                this.$refs.appForm.validate((valid) => {
                if (valid) {
                    if(!this.editFlag){
                        this.createApp(this.form).then(res=>{
                            if(!res)return;
                            this.handleClose(res)
                        })
                        return
                    }
                    this.updateApp(this.form).then(res=>{
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
    .create_edit{
        .el-dialog{
            margin-top:3vh !important; 
        }
    }
</style>